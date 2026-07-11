// ========== hs-im iOS TencentCloudIM 桥接头文件 ==========
// 对应 Android 端 IMBridge.kt
// 提供 TIM SDK 的静态方法供 UTS 层调用

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

// 消息类型
typedef NS_ENUM(NSInteger, IMMessageType) {
    IMMessageTypeText = 0,
    IMMessageTypeImage = 1,
    IMMessageTypeVideo = 2,
    IMMessageTypeVoice = 3,
    IMMessageTypeCustom = 4
};

// 登录状态
typedef NS_ENUM(NSInteger, IMConnectionState) {
    IMConnectionStateDisconnected = 0,
    IMConnectionStateConnecting = 1,
    IMConnectionStateConnected = 2
};

// 消息信息（传递给 UTS 的 block 回调）
typedef void (^IMMessageItemBlock)(NSString *msgId, NSString *sender, NSInteger type, NSString *text, NSString *extra, long long timestamp, BOOL isSelf);

// 消息列表完成回调
typedef void (^IMMessageListCompleteBlock)(NSInteger total, NSString *error);

// 单条消息回调
typedef void (^IMSingleMessageBlock)(NSString *msgId, NSString *sender, NSInteger type, NSString *text, NSString *extra, long long timestamp, BOOL isSelf);

// 基础回调
typedef void (^IMSimpleCallback)(void);
typedef void (^IMErrorCallback)(NSInteger code, NSString *desc);

// 腾讯云 IM 桥接类
@interface IMBridge : NSObject

#pragma mark - 回调设置

/// 设置登录成功回调
+ (void)setOnLoginSuccess:(nullable IMSimpleCallback)callback;

/// 设置登录失败回调
+ (void)setOnLoginFailed:(nullable IMErrorCallback)callback;

/// 设置登出成功回调
+ (void)setOnLogoutSuccess:(nullable IMSimpleCallback)callback;

/// 设置被踢回调
+ (void)setOnKickedOffline:(nullable IMSimpleCallback)callback;

/// 设置 UserSig 过期回调
+ (void)setOnUserSigExpired:(nullable IMSimpleCallback)callback;

/// 设置连接中回调
+ (void)setOnConnecting:(nullable IMSimpleCallback)callback;

/// 设置连接成功回调
+ (void)setOnConnectSuccess:(nullable IMSimpleCallback)callback;

/// 设置连接失败回调
+ (void)setOnConnectFailed:(nullable IMErrorCallback)callback;

/// 设置收到消息回调
+ (void)setOnMessageReceived:(nullable void (^)(NSString *msgId, NSString *sender, NSInteger type, NSString *text, NSString *extra, long long timestamp, BOOL isSelf))callback;

/// 设置消息撤回回调
+ (void)setOnMessageRevoked:(nullable void (^)(NSString *msgId))callback;

#pragma mark - 初始化与登录

/// 初始化 SDK
/// @param sdkAppId 应用 ID
/// @return 是否成功
+ (BOOL)initWithSdkAppId:(NSInteger)sdkAppId;

/// 是否已初始化
+ (BOOL)isInitialized;

/// 登录
/// @param userId 用户 ID
/// @param userSig 用户签名
+ (BOOL)login:(NSString *)userId userSig:(NSString *)userSig;

/// 登出
+ (BOOL)logout;

/// 是否已登录
+ (BOOL)isLoggedIn;

/// 获取当前用户 ID
+ (nullable NSString *)getCurrentUserId;

#pragma mark - 消息发送

/// 发送文本消息
/// @param toUserId 目标用户 ID
/// @param text 文本内容
/// @return 消息 ID，失败返回空串
+ (NSString *)sendTextMessage:(NSString *)toUserId text:(NSString *)text;

/// 发送图片消息
/// @param toUserId 目标用户 ID
/// @param imagePath 图片路径
/// @return 消息 ID
+ (NSString *)sendImageMessage:(NSString *)toUserId imagePath:(NSString *)imagePath;

/// 发送视频消息
/// @param toUserId 目标用户 ID
/// @param videoPath 视频路径
/// @param videoType 视频类型
/// @param duration 时长（秒）
/// @param snapshotPath 封面路径
/// @return 消息 ID
+ (NSString *)sendVideoMessage:(NSString *)toUserId videoPath:(NSString *)videoPath videoType:(NSInteger)videoType duration:(NSInteger)duration snapshotPath:(NSString *)snapshotPath;

/// 发送语音消息
/// @param toUserId 目标用户 ID
/// @param voicePath 语音路径
/// @param duration 时长（秒）
/// @return 消息 ID
+ (NSString *)sendVoiceMessage:(NSString *)toUserId voicePath:(NSString *)voicePath duration:(NSInteger)duration;

/// 发送自定义消息
/// @param toUserId 目标用户 ID
/// @param data 自定义数据
/// @param desc 描述
/// @param extension 扩展
/// @return 消息 ID
+ (NSString *)sendCustomMessage:(NSString *)toUserId data:(NSString *)data desc:(NSString *)desc extension:(NSString *)extension;

#pragma mark - 消息历史记录

/// 从服务端拉取 C2C 历史消息（分页）
/// @param peerUserId 对方用户 ID
/// @param count 拉取条数
/// @param lastMsgId 上一页最后一条消息的 msgId，首次传空串
/// @param onItem 逐条回调
/// @param onComplete 完成回调
+ (void)getC2CMessageList:(NSString *)peerUserId
                    count:(NSInteger)count
                lastMsgId:(NSString *)lastMsgId
                   onItem:(IMSingleMessageBlock)onItem
               onComplete:(IMMessageListCompleteBlock)onComplete;

/// 从本地缓存获取消息列表
/// @param peerUserId 对方用户 ID
/// @param count 拉取条数
/// @param onItem 逐条回调
/// @param onComplete 完成回调
+ (void)loadMessages:(NSString *)peerUserId
              count:(NSInteger)count
             onItem:(IMSingleMessageBlock)onItem
         onComplete:(IMMessageListCompleteBlock)onComplete;

#pragma mark - 消息管理

/// 删除消息（本地）
/// @param msgId 消息 ID
/// @return 是否成功
+ (BOOL)deleteMessage:(NSString *)msgId;

/// 撤回消息
/// @param msgId 消息 ID
/// @return 是否成功
+ (BOOL)revokeMessage:(NSString *)msgId;

#pragma mark - 已读标记

/// 标记 C2C 消息已读
/// @param userId 用户 ID
/// @return 是否成功
+ (BOOL)markC2CMessageAsRead:(NSString *)userId;

/// 标记群消息已读
/// @param groupId 群 ID
/// @return 是否成功
+ (BOOL)markGroupMessageAsRead:(NSString *)groupId;

/// 发送已读回执
/// @param msgIds 消息 ID 列表（逗号分隔）
/// @return 是否成功
+ (BOOL)sendMessageReadReceipts:(NSString *)msgIds;

#pragma mark - 资源释放

/// 销毁实例，释放资源
+ (void)destroy;

@end

NS_ASSUME_NONNULL_END
