// ========== hs-bluetooth iOS CoreBluetooth 桥接头文件 ==========
// 封装 CBCentralManager delegate 回调为 block 形式供 UTS 层调用

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

NS_ASSUME_NONNULL_BEGIN

/// 发现的 BLE 设备信息
@interface BleDeviceInfo : NSObject
@property (nonatomic, copy) NSString *name;
@property (nonatomic, copy) NSString *identifier;
@property (nonatomic, assign) NSInteger rssi;
@end

/// CoreBluetooth 桥接类 — 管理 CBCentralManager 生命周期
/// UTS 通过此类静态方法完成所有蓝牙操作
@interface BleCentralHelper : NSObject <CBCentralManagerDelegate, CBPeripheralDelegate>

/// 单例
+ (instancetype)sharedInstance;

/// 当前蓝牙状态
@property (nonatomic, assign, readonly) CBManagerState bluetoothState;
/// 是否正在扫描
@property (nonatomic, assign, readonly) BOOL isScanning;
/// 已发现设备列表
@property (nonatomic, strong, readonly) NSMutableArray<BleDeviceInfo *> *discoveredDevices;
/// 当前连接的 peripheral
@property (nonatomic, strong, nullable) CBPeripheral *connectedPeripheral;
/// 数据传输用的 characteristic
@property (nonatomic, strong, nullable) CBCharacteristic *txCharacteristic;

/// 回调（由 UTS 层赋值或通过通知传递）
@property (nonatomic, copy, nullable) void (^onStateUpdated)(CBManagerState state);
@property (nonatomic, copy, nullable) void (^onDeviceDiscovered)(BleDeviceInfo *device);
@property (nonatomic, copy, nullable) void (^onScanStopped)(void);
@property (nonatomic, copy, nullable) void (^onConnected)(NSString *identifier);
@property (nonatomic, copy, nullable) void (^onDisconnected)(void);
@property (nonatomic, copy, nullable) void (^onDataReceived)(NSString *data);
@property (nonatomic, copy, nullable) void (^onError)(NSString *message);

/// 初始化蓝牙
- (void)initCentral;

/// 开始扫描
- (void)startScan;

/// 停止扫描
- (void)stopScan;

/// 连接设备
- (void)connectToPeripheral:(NSString *)identifier;

/// 断开连接
- (void)disconnect;

/// 发送数据
- (void)sendData:(NSString *)text;

/// 清理
- (void)cleanup;

@end

NS_ASSUME_NONNULL_END
