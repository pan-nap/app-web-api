// ========== hs-bluetooth iOS CoreBluetooth 桥接实现 ==========

#import "BleCentralHelper.h"

@implementation BleDeviceInfo
@end

@interface BleCentralHelper ()
@property (nonatomic, strong) CBCentralManager *centralManager;
@property (nonatomic, strong) NSMutableArray<BleDeviceInfo *> *discoveredDevices;
@property (nonatomic, assign) BOOL isScanning;
@property (nonatomic, assign) CBManagerState bluetoothState;
@end

@implementation BleCentralHelper

static BleCentralHelper *_sharedInstance = nil;

+ (instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [[BleCentralHelper alloc] init];
    });
    return _sharedInstance;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _discoveredDevices = [NSMutableArray array];
        _bluetoothState = CBManagerStateUnknown;
        _isScanning = NO;
    }
    return self;
}

// MARK: - 初始化

- (void)initCentral {
    if (self.centralManager != nil) return;
    dispatch_queue_t queue = dispatch_get_main_queue();
    self.centralManager = [[CBCentralManager alloc] initWithDelegate:self
                                                               queue:queue
                                                             options:@{
        CBCentralManagerOptionShowPowerAlertKey: @(YES)
    }];
}

// MARK: - 扫描

- (void)startScan {
    if (self.centralManager == nil) return;
    if (self.bluetoothState != CBManagerStatePoweredOn) {
        if (self.onError) self.onError(@"蓝牙未开启");
        return;
    }
    [self.discoveredDevices removeAllObjects];
    [self.centralManager scanForPeripheralsWithServices:nil options:@{
        CBCentralManagerScanOptionAllowDuplicatesKey: @(NO)
    }];
    self.isScanning = YES;
}

- (void)stopScan {
    if (self.centralManager == nil) return;
    [self.centralManager stopScan];
    self.isScanning = NO;
    if (self.onScanStopped) self.onScanStopped();
}

// MARK: - 连接

- (void)connectToPeripheral:(NSString *)identifier {
    if (self.centralManager == nil) return;
    // 从已发现设备列表中查找
    CBPeripheral *target = nil;
    for (CBPeripheral *peri in [self.centralManager.retrievePeripheralsWithIdentifiers:@[[[NSUUID alloc] initWithUUIDString:identifier]]]) {
        target = peri;
        break;
    }
    // fallback: 从已知 peripherals 查找
    if (target == nil) {
        for (CBPeripheral *peri in [self.centralManager retrieveConnectedPeripheralsWithServices:@[]]) {
            if ([peri.identifier.UUIDString isEqualToString:identifier]) {
                target = peri;
                break;
            }
        }
    }
    if (target == nil) {
        if (self.onError) self.onError(@"未找到设备");
        return;
    }
    self.connectedPeripheral = target;
    target.delegate = self;
    [self.centralManager connectPeripheral:target options:@{
        CBConnectPeripheralOptionNotifyOnDisconnectionKey: @(YES)
    }];
}

- (void)disconnect {
    if (self.connectedPeripheral != nil && self.centralManager != nil) {
        [self.centralManager cancelPeripheralConnection:self.connectedPeripheral];
    }
}

// MARK: - 数据发送

- (void)sendData:(NSString *)text {
    if (self.connectedPeripheral == nil || self.txCharacteristic == nil) {
        if (self.onError) self.onError(@"未连接设备或未找到可写特征");
        return;
    }
    NSData *data = [text dataUsingEncoding:NSUTF8StringEncoding];
    [self.connectedPeripheral writeValue:data
                      forCharacteristic:self.txCharacteristic
                                   type:CBCharacteristicWriteWithResponse];
}

// MARK: - 清理

- (void)cleanup {
    [self stopScan];
    [self disconnect];
    self.connectedPeripheral = nil;
    self.txCharacteristic = nil;
    [self.discoveredDevices removeAllObjects];
    self.onStateUpdated = nil;
    self.onDeviceDiscovered = nil;
    self.onScanStopped = nil;
    self.onConnected = nil;
    self.onDisconnected = nil;
    self.onDataReceived = nil;
    self.onError = nil;
}

// MARK: - CBCentralManagerDelegate

- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
    self.bluetoothState = central.state;
    if (self.onStateUpdated) self.onStateUpdated(central.state);
}

- (void)centralManager:(CBCentralManager *)central
 didDiscoverPeripheral:(CBPeripheral *)peripheral
     advertisementData:(NSDictionary<NSString *, id> *)advertisementData
                  RSSI:(NSNumber *)RSSI {
    // 跳过已连接的设备
    if (peripheral.state == CBPeripheralStateConnected) return;
    // 跳过无名称设备
    NSString *name = peripheral.name ?: @"";
    if (name.length == 0) return;

    // 去重
    for (BleDeviceInfo *info in self.discoveredDevices) {
        if ([info.identifier isEqualToString:peripheral.identifier.UUIDString]) {
            return;
        }
    }

    BleDeviceInfo *device = [[BleDeviceInfo alloc] init];
    device.name = name;
    device.identifier = peripheral.identifier.UUIDString;
    device.rssi = RSSI.integerValue;
    [self.discoveredDevices addObject:device];

    if (self.onDeviceDiscovered) self.onDeviceDiscovered(device);
}

- (void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral {
    // 连接成功，开始发现服务
    [peripheral discoverServices:nil];
}

- (void)centralManager:(CBCentralManager *)central didFailToConnectPeripheral:(CBPeripheral *)peripheral
                 error:(nullable NSError *)error {
    NSString *msg = error != nil ? error.localizedDescription : @"连接失败";
    if (self.onError) self.onError(msg);
}

- (void)centralManager:(CBCentralManager *)central didDisconnectPeripheral:(CBPeripheral *)peripheral
                 error:(nullable NSError *)error {
    self.connectedPeripheral = nil;
    self.txCharacteristic = nil;
    if (self.onDisconnected) self.onDisconnected();
}

// MARK: - CBPeripheralDelegate

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(nullable NSError *)error {
    if (error != nil) {
        if (self.onError) self.onError(error.localizedDescription);
        return;
    }
    // 发现服务后，遍历所有服务查找 characteristic
    for (CBService *service in peripheral.services) {
        [peripheral discoverCharacteristics:nil forService:service];
    }
}

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverCharacteristicsForService:(CBService *)service
             error:(nullable NSError *)error {
    if (error != nil) return;
    for (CBCharacteristic *chr in service.characteristics) {
        // 找到第一个可写的 characteristic 作为 TX
        if (chr.properties & (CBCharacteristicPropertyWrite | CBCharacteristicPropertyWriteWithoutResponse)) {
            self.txCharacteristic = chr;
        }
        // 订阅可通知的 characteristic 作为 RX
        if (chr.properties & CBCharacteristicPropertyNotify) {
            [peripheral setNotifyValue:YES forCharacteristic:chr];
        }
    }

    // 至少找到一个可写特征才算连接完成
    if (self.txCharacteristic != nil && self.onConnected) {
        self.onConnected(peripheral.identifier.UUIDString);
    }
}

- (void)peripheral:(CBPeripheral *)peripheral didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic
             error:(nullable NSError *)error {
    if (error != nil) return;
    NSData *data = characteristic.value;
    if (data.length == 0) return;
    NSString *text = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    if (text != nil && self.onDataReceived) {
        self.onDataReceived(text);
    }
}

- (void)peripheral:(CBPeripheral *)peripheral didWriteValueForCharacteristic:(CBCharacteristic *)characteristic
             error:(nullable NSError *)error {
    if (error != nil && self.onError) {
        self.onError(error.localizedDescription);
    }
}

@end
