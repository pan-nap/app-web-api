# STOMP 插件开发经验

## STOMP vs MQTT 协议选择

| 对比项           | STOMP                             | MQTT                       |
| ---------------- | --------------------------------- | -------------------------- |
| **数据格式**     | 文本帧（字符串）                  | 二进制帧（Uint8Array）     |
| **连接方式**     | WebSocket 直接发送文本            | WebSocket 发送 ArrayBuffer |
| **适用场景**     | ActiveMQ、RabbitMQ 等传统消息队列 | IoT、物联网低带宽场景      |
| **UTS 实现难度** | 中等（字符串解析）                | 高（二进制编解码）         |

**两者不能共用同一个 UTS 插件**，需分别创建独立的插件（如 `hs-stomp` 和 `hs-mqtt`）。

## STOMP 帧结构

STOMP 是基于文本的帧协议，结构如下：

```
COMMAND
header1:value1
header2:value2

body^@
```

- 命令和 header 以换行符 `\n` 分隔
- headers 以空行结束
- body 后面以 NULL 字符 `\x00` 结束

## STOMP 帧构建与解析

**构建帧**：用字符串拼接，headers 改用 `string[]`（key:value 格式）代替 `Map`：

```typescript
function buildFrame(command: string, headers: string[], body: string = ""): string {
  let frame = command + "\n";
  for (let i = 0; i < headers.length; i++) {
    frame += (headers[i] as string) + "\n";
  }
  frame += "\n" + body + "\x00";
  return frame;
}
```

**解析帧**：按 NULL 字符分割，再按换行解析 headers：

```typescript
function parseFrame(data: string): StompFrame | null {
  const nullIdx = data.indexOf("\x00");
  // ... 按行分割，第一行是 command，空行前是 headers，空行后是 body
}
```

## WebSocket 子协议（重要）

连接 STOMP 服务端（如 ActiveMQ）时，需在 `connectSocket` 中指定子协议：

```typescript
this.socketTask = uni.connectSocket({
  url,
  protocols: ["v12.stomp", "v11.stomp", "v10.stomp"] // ← 必须
  // ...
});
```

不指定子协议可能导致服务器返回 400 (Bad Request) 错误。

## STOMP 连接流程

```
1. WebSocket 连接建立（onOpen）
2. 发送 STOMP CONNECT 帧（含 login/passcode/accept-version/heart-beat 等 header）
3. 服务端回复 CONNECTED 帧（表示连接成功）
4. 发送 SUBSCRIBE 帧订阅主题（含 id/destination/selector）
5. 服务端推送 MESSAGE 帧（含 destination/body/headers）
6. 发送 SEND 帧发布消息（含 destination/content-type）
```

## 心跳机制

STOMP 心跳通过发送**换行符** `\n`（或空格）实现，不是二进制帧。在 UTS 中使用 `setTimeout` 定期发送：

```typescript
private sendHeartbeat(): void {
  if (this.socketTask != null && this.connected) {
    this.socketTask.send({ data: "\n" })
  }
}
```

### ⚠️ 接收侧必须剥掉心跳残留的 EOL（实测会静默丢消息，极难发现）

ActiveMQ 也会按协商周期推心跳帧，而**心跳帧只有 `\n`、没有 `\0`**。若 `handleData` 只用 `\0` 切帧，这些换行会一直留在 buffer 开头；下一条真帧到达时被拼在其后，`parseFrame` 取第一行当 command 就得到**空串**，三个命令分支也都不匹配 → **整条 MESSAGE 被静默丢弃**。

后果：只要连接空闲超过一个心跳周期（默认 4s），紧随其后的**第一条消息必丢**；而业务推送基本都是“空闲一会儿才来一条”，表现就是“经常收不到推送”，但帧级日志里 MESSAGE 明明到了 socket。

修法（切帧前先剥掉开头的 EOL）：

```uts
while (this.buffer.length > 0 && (this.buffer.substring(0, 1) == NEWLINE || this.buffer.substring(0, 1) == "\r")) {
	this.buffer = this.buffer.substring(1);
}
const nullIdx = this.buffer.indexOf(NULL_CHAR);
```

用 `substring(0, 1) ==` 而不是 `startsWith`，编译到 Kotlin 更稳。

### ⚠️ 重连后必须重发 SUBSCRIBE

服务端会话随连接关闭失效。插件内部 `startReconnect` 若只重发 `CONNECT`，重连后 `isConnected()` 是 true 但**一条消息都收不到**。两种正确做法：

- 在“收到 CONNECTED”的分支里遍历**已有**订阅记录重发帧（复用原 id、不新增记录）。如果图省事直接再调一次 `subscribe()`，同主题会有两份订阅，一条消息回调两次 → 上层 `uni.$emit` 双发、通知重复弹。
- 或者像 `@stomp/stompjs` 那样把订阅写在 `client.onConnect` 里，重连自然重跑（hs-his-web 就是这么写的，所以它没这个问题）。

### ⚠️ 鉴权失败时 ActiveMQ 不回 ERROR 帧

实测密码错误时服务端直接掉 WebSocket，不发 STOMP `ERROR`。所以 `onClose` 里必须把挂着的 `connect()` Promise 结算掉（resolve(false) 或 reject 一个带原因的 Error），否则上层 `await connect()` 永久 pending；只 `reject(false)` 会让日志里只剩下一个 `false`，看不出是鉴权还是断网。

### ⚠️ MESSAGE 必须按 `subscription` 头分发，不能按 destination

插件如果写成“遍历订阅列表、`sub.destination == 消息 destination` 就回调”，那么**同一主题上的多份订阅会互相串消息**：服务端按 selector 只推给命中的那一份，但帧一到就发给了同主题的全部回调，等于把服务端的过滤结果在客户端又抹平了（也会让 `--fault selector` 类型的对比测试得出假结论）。STOMP 1.2 要求服务端在 MESSAGE 帧里回带 `subscription`（即 SUBSCRIBE 的 id），按它精确分发；只有头缺失（兼容不规范服务端）才退化到按 destination 匹配。

### ⚠️ 服务端 selector 只对消息头/property 求值，不看 JSON body

实测（ActiveMQ，`--fault selector`）：同一条自发消息只在 body 里写 `selector_id`，不带 selector 的订阅收到 1 条、带 `selector_id='xxx'` 的订阅收到 0 条。两个后果：

- 后端必须把 `selector_id` 写进 STOMP 消息头，服务端过滤才生效；光靠 selector 不能当安全线，**客户端仍要按 body 做二级过滤**（hs-his-web 就是 selector + `selector_id.includes()` + `project_code` 相等两道）。
- 订阅时归属字段为空就**不要带 selector**（`selector_id=''` 会一条都收不到，而现象与“链路挂了”完全一样）。

### ⚠️ 插件方法的参数形状：调用方与 `interface.uts` 声明必须一致

**踩过的坑**：`utils/stomp.uts` 照搬 `@stomp/stompjs` 的 `subscribe(topic, cb, { selector })` 传对象，而插件当时声明的是 `selector: string | null`。`publish` 不做类型检查所以编译不报，**真机运行时在 JS→原生桥接处直接炸**：

```
Error: java.lang.ClassCastException: io.dcloud.uts.UTSJSONObject cannot be cast to java.lang.String
  at uts.sdk.modules.hsStomp.UniUTSMethodRegister$Companion.registerUTSMethod$lambda$6(index.kt:495)
```

报错落在调用方的 `catch` 里（看起来像“客户端创建失败”），实际出错行是参数强转 —— 栈里出现 `UniUTSMethodRegister` 就说明是插件导出方法的桥接入参类型对不上，不要怀疑业务逻辑。

**现在的口径**：插件已按 stompjs 形状改为对象参数（`interface.uts` 里 `export type SubscribeOptions = { selector ?: string | null }`，`subscribe(destination, onMessage, options: SubscribeOptions | null = null)`）。官方推荐复杂入参就用自定义 `type`（`plugin/uts-plugin.md:572`），且 HBuilderX **5.25+ 蒸汽模式 Android 桥接是 codegen、不走序列化**（`app-vapor.md`），本项目 5.34 实测生成的转换代码正确。

**代价（必须知道）**：codegen 出来的是按键名取值的转换函数 ——

```kotlin
// appResource 产物里生成的 index.kt
fun createUTSSubscribeOptions(options: UTSJSONObject): SubscribeOptions =
    SubscribeOptions(options.get("selector") as String?)
```

键名打错（`seletor`）、值传成 number 都**不再崩**：前者 `get` 返回 null，等于订阅不带 selector（收同门店全量消息）；后者才在 `as String?` 抛 ClassCastException。所以改成对象后，调用方传 selector 只走模板字符串，别传变量以外的东西，且改完必须验生成的 `index.kt`（见下一节）。

### ⚠️ 出向心跳不等于链路还活着（插件已加入向监督）

插件原来只按 `heartbeatOutgoing` 往外发换行帧，从不校验入向。socket 被系统静默掐断时 `onClose/onError` 可能一次都不回调，`connected` 停在 true，于是“心跳正常、推送永不到”。现在 `onMessage` 里记 `lastReceiveTime`（纯 EOL 心跳帧也算），心跳 tick 顺带跑 `checkDeadConnection()`：静默超过 `deadTimeoutMs()`（默认 `heartbeatIncoming×3`且不少于 30000ms，可用 `config.heartbeatTimeout` 覆盖；`heartbeatIncoming<=0` 则关掉监督）就 `dropAndReconnect()` —— 只拆 socket，不动 `subscriptions`，重连拿到 CONNECTED 后照原记录重发订阅。

误杀健康连接的代价比漏判更大，所以阈值给得宽（默认 30s），且 `heartbeatIncoming: 0` 可以整体关掉。

### ⚠️ 旧 socket 迟到的回调会拆掉刚建好的新连接

`dropAndReconnect()` → 5s 后 `connect()` 建好新 socket → 旧 socket 的 `onClose` 这时才到，把 `connected` 改回 false 并又开一个 socket → 两条链路、两份订阅、消息双发。修法是加连接代数：`connect()` 开头 `connSeq++` 并用局部 `seq` 闭包捕获，`onOpen/onMessage/onError/onClose` 首行都判 `if (seq != this.connSeq) return;`，`disconnect()`/`dropAndReconnect()` 也递增。`connect()` 开头还会先 `close()` 掉上一轮没结算的 socket（否则漏连接），并重置 `buffer`。

另外加了 `CONNECT_TIMEOUT`（10s）握手监督：发了 CONNECT 既没 CONNECTED 也没 close/error 时，心跳还没启动、没有任何定时器在跑，不兜住就永久卡“未连接”。超时回调同样先过 `seq` 门再拆链。

### ⚠️ 插件内部重连路径上不要 reject `connect()` 的 Promise

`startReconnect()` 里的 `this.connect(this.config)` 没人在 await，原来的 `reject(new Error(...))` 会变成 unhandled rejection。现在失败路径统一 `resolve(false)` + `console.error` 写清原因（调用方本来就是 `if (ok != true) throw`，语义不变）。同理，覆盖 `pendingResolve` 前先把旧的那份以 false 结掉，不然那个 await 永久挂住。

### ⚠️ 重连退避与定时器的职责划分

`startReconnect()` 不再 `clearTimers()`（那会把自己的 `reconnectTimer` 清掉，使“已有待发重连”的保护形同不存在），而是 `if (this.reconnectTimer != null) return;` + `clearHeartbeat()` + `config == null` 直接返回。退避 `nextReconnectDelay()`：5s 起步、每次翻倍、上限 30s（不用 `Math.pow`，编译到 Kotlin 更稳），收到 CONNECTED 归零。`sendHeartbeat()` 里也要先确认 `this.connected` 再排下一次心跳，否则判死拆链后心跳会一直空转。

## App 侧接入约定（utils/stomp.uts）

- **唯一调用点：`App.uvue` 的 `onAppShow`**。冷启动生命周期是 `onLaunch` → `onAppShow`，所以“切前台”这一个入口同时覆盖首次连接与断网自愈；别再在 `main.uts` / `onLaunch` 重复调用（重复调用点就是并发建连的来源）。
- **单例已存在时不能直接 return，要调 `checkAlive()`**：Android 切后台会冻结 JS 定时器，插件那个 5s `reconnectTimer` 根本没跑，回来也不会自己补，于是“实例还在、链路已死、永远不再重连”。`checkAlive()` 已断开就清掉待发定时器、退避归零并直接重连；仍标着已连接则延后 1500ms 再按入向超时判死 —— 不在切前台时直接拆连接，因为后台期间排队的入向帧会在恢复后补投，先拆就把它们丢了。上层判活用 `checkAlive()`，不要用 `isConnected()`（它只代表“收到过 CONNECTED”）。
- **单例必须“连上 + 订阅下发完”之后才赋值**。反过来（先赋值再 `await connect()`）时，首次失败会被 catch 跳过订阅、却留下一个非 null 的死实例，后续调用直接命中 `return`，整条链路永久静默。
- **失败路径调 `disconnect()`**：它会清掉重连定时器并置空 socket，把重建交给下一次 `onAppShow`；留着那份没有订阅的自动重连只会误导排查。
- **用一个 `connecting` 布尔挡住异步并发**：`onAppShow` 可以连续触发（快速切前后台、broker 连不上时用户重试），而 `connect()` 是异步的，没这个标志会开出两个都带订阅的 socket，同一条消息 `$emit` 两次。
- 页面收消息统一用 `useStompMessage()`（在 setup 里调用，内部 `onUnmounted` 自动 `uni.$off`）。
- h5 分支取同源 `location.hostname`/`location.port`，靠 **`vite.config.js` 的 `server.proxy["/stomp"]: { target, ws: true, changeOrigin: true }`** 转到 broker（与 hs-his-web 写法一致）；开发环境实测可用（`node scripts/stomp-probe.js --proxy --send` 自己起 dev server 并经过代理跑完 4/4）。注意代理配在 `vite.config.js` 而不是 `manifest.json -> web`，只查后者会误判成“没配”。打包后的 web 部署需服务端提供同样的 `/stomp` 反代。
- 消息过滤两道：订阅时能取到归属值就带服务端 selector（`business` 用 `selector_id like '%id%'`，其余精确匹配），取不到就不带；回调里无条件做 body 二级过滤（`selector_id` 拆逗号命中本人 + `project_code` 相等）。这样“App 切前台订阅早于登录”不需要重新订阅：过滤值在消息到达时才从 store 取。代价是未登录期间会收全量，所以 `matchSelf` 在归属值为空时丢弃并告警，不能放行。
- **冷启动目前只有 token 被缓存**（`store/user.uts` 只 `storage.set(TOKEN, ...)`），`info.id/company_id/project_code` 都是空串，所以自动登录场景下消息会被二级过滤全部丢弃，直到重新登录。要彻底对齐 web，得把整份 user info 也持久化（hs-his-web 的 `systemStore.set('userInfo', ...)` 就是这么做的）。

## 插件改动的验证方式

`publish app-android --type appResource` 的产物里 **`app-service.js` 不含插件实现体**（实测 `connectSocket`/`SUBSCRIBE` 字面量搜不到，只有调用方 utils 的字符串），所以不能拿它验协议逻辑；但产物会带**生成的 Kotlin 源码**：

```
unpackage/resources/app-android/uni_modules/hs-stomp/utssdk/app-android/src/index.kt
```

这是不用打自定义基座就能验桥接的最快路径 —— 改完插件签名直接 grep 它：

```bash
grep -n "subscribe\|createUTS" unpackage/resources/app-android/uni_modules/hs-stomp/utssdk/app-android/src/index.kt
```

看两件事：① `open fun subscribe(..., options: SubscribeOptions? = null)` 是否与 `.uts` 声明一致；② 注册分支里入参怎么转 —— 对象参数应看到 `if (params[3] == null) null else createUTSSubscribeOptions(params[3] as UTSJSONObject)`（带 null 保护），若看到 `as String` 就说明声明与调用方又不匹配了，真机必炸。

注意：appResource “编译成功”≠ APK 里的插件是新版。**改了 `utssdk/` 下任何代码，必须重打自定义基座（或 APK）才会进手机**，否则跑的还是旧逻辑（心跳丢帧、按 destination 串消息那类 bug 只在旧基座里存在）。

协议层可以在 Node 里直接跑插件源码做回归：把 `.uts` 用 typescript 转译后执行，并给 `globalThis.uni.connectSocket` 打一个基于 Node 原生 WebSocket 的 shim。本项目例子：`packages/hs-his-app/scripts/stomp-probe.js`，支持 `--send`、`--fault auth|unreachable|idle|reconnect|selector`、`--proxy`（自己拉起 h5 dev server，经 vite 代理连 broker，验 h5 链路）、`--trace`（帧级收发）。探针跑的是转译后的 JS，**不经过 Kotlin 桥接**，所以它只能验协议逻辑，参数类型跨桥的问题只有上面 grep `index.kt` 或真机能发现。

`--proxy` 里拉起 dev server 的 spawn 参数不能想当然：cwd 必须是 `HBuilderX/plugins/uniapp-cli-vite`，输入目录用 `UNI_INPUT_DIR` 传（写在项目根目录下直接 `code=1` 退出）；端口从 vite 输出的 `Local:` 行里抓，不要硬编 `vite.config.js` 里的 `server.port`（被占时会自动换一个，实测拿到的是 8100 而不是 8099）。

## 导出方法回调保活（"回调函数已释放，不能再次执行"）

**报错现场**（真机 Android 运行日志）：

```
uts插件[hs-stomp] uts.sdk.modules.hsStompStompClientByJs.subscribe 回调函数 已释放，不能再次执行，参考文档：https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin.html#keepalive
```

- 订阅后连续收到 N 条消息通常报 N-1 次（首次触发后回调即被回收）。
- 日志中的 `hsStompStompClientByJs` 是框架桥接命名，不代表仅 JS 调用才触发。

**原因**：HBuilderX 4.25+ 中 UTS 插件**导出方法**的回调参数默认"触发一次后立即自动回收"（防泄漏）。`subscribe()` 把调用方传入的 `onMessage` 存进订阅记录（如 `SubRecord.onMessage` 字段），之后每条 MESSAGE 帧再回调时，回调已被释放。

**解决**：`uni_modules/hs-stomp/utssdk/index.uts` 的 `subscribe()` 前加 `@UTSJS.keepAlive`：

```typescript
@UTSJS.keepAlive
export class StompClient {
  subscribe(destination: string, onMessage: (msg: StompMessage) => void, options: SubscribeOptions | null = null): string | null {
    const sub = new SubRecord();
    sub.onMessage = onMessage; // 长期保存 ✅ 可多次回调
    this.subscriptions.push(sub);
    return sub.id;
  }
}
```

**保活规则**：

- 方式一：方法名以 `on` 开头且仅一个回调参数 → 自动识别为可持续触发，无需装饰器。
- 方式二：`@UTSJS.keepAlive` 装饰器 → 不限回调参数数量，导出函数与 class 方法均可标注。
- 回调常驻内存：属"一次性注册、长期回调"场景，避免高频重复调用注册方法堆积对象。
- 装饰器不支持 `export const fn = () => {}` 箭头导出，需写成 `export function`。
- `app-android` / `app-ios` 各平台目录下的实现都需加；Web 端无此回收机制，坑点只在 App 端暴露。
- 内置 API（`uni.connectSocket`、`SocketTask.onMessage` 等）回调由 SDK 管理，不受影响；仅 **uni_modules 插件导出方法**有此限制。

**同类对照**：`hs-mqtt` 的 `MqttClient.subscribe()` 不接收外部回调（消息走内部 `onMessageReceive` 属性 + `uni.$emit`），无此问题。hs-\* 系列插件若再报同错，对相应导出方法加 `@UTSJS.keepAlive` 即可。

### Web 端编译告警：`Cannot find name 'UTSJS'`

**现象**（Web/H5 dev 构建，不阻断编译但污染日志）：

```
warning: Cannot find name 'UTSJS'.
  at uni_modules/hs-stomp/utssdk/index.uts:254:3
    @UTSJS.keepAlive
```

**原因**：`@UTSJS.keepAlive` 仅 App 原生端（Android/iOS）编译器识别；**Web 编译不导入 `UTSJS`**，装饰器 token 直接报"找不到名称"。装饰器本身只解决 App 端原生桥接的回调回收问题，Web 端无需且无此对象。

**解决**：hs-stomp 是"单个 `utssdk/index.uts` 多端共用"结构，装饰器必须用条件编译限定到 App 原生端：

```typescript
  /** 订阅主题 */
  // #ifdef APP-ANDROID || APP-IOS
  @UTSJS.keepAlive
  // #endif
  subscribe(destination: string, onMessage: (msg: StompMessage) => void, options: SubscribeOptions | null = null): string | null {
```

- 条件编译注释必须**单独成行**，与装饰器行相邻。
- 若插件是"按平台目录拆分"结构（`app-android/`、`app-ios/`、`web/` 各一份 index.uts），则只在 App 平台文件加 `@UTSJS.keepAlive`、`web/index.uts` 不加即可，无需条件编译。
- 参考：https://doc.dcloud.net.cn/uni-app-x/web 下相关说明。
