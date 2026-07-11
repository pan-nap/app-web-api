// ========== hs-im iOS UTS 桥接辅助类实现 ==========
// 桥接 IMBridge 到 UTS

#import "IMBridgeHelper.h"
#import "IMBridge.h"

@implementation IMBridgeHelper

+ (instancetype)sharedInstance {
    static IMBridgeHelper *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[IMBridgeHelper alloc] init];
    });
    return instance;
}

#pragma mark - 回调设置

+ (void)setOnLoginSuccess:(void (^)(void))callback {
    [IMBridge setOnLoginSuccess:callback];
}

+ (void)setOnLoginFailed:(void (^)(NSInteger, NSString *))callback {
    [IMBridge setOnLoginFailed:callback];
}

+ (void)setOnLogoutSuccess:(void (^)(void))callback {
    [IMBridge setOnLogoutSuccess:callback];
}

+ (void)setOnKickedOffline:(void (^)(void))callback {
    [IMBridge setOnKickedOffline:callback];
}

+ (void)setOnUserSigExpired:(void (^)(void))callback {
    [IMBridge setOnUserSigExpired:callback];
}

+ (void)setOnConnecting:(void (^)(void))callback {
    [IMBridge setOnConnecting:callback];
}

+ (void)setOnConnectSuccess:(void (^)(void))callback {
    [IMBridge setOnConnectSuccess:callback];
}

+ (void)setOnConnectFailed:(void (^)(NSInteger, NSString *))callback {
    [IMBridge setOnConnectFailed:callback];
}

+ (void)setOnMessageReceived:(void (^)(NSString *, NSString *, NSInteger, NSString *, NSString *, long long, BOOL))callback {
    [IMBridge setOnMessageReceived:callback];
}

+ (void)setOnMessageRevoked:(void (^)(NSString *))callback {
    [IMBridge setOnMessageRevoked:callback];
}

#pragma mark - 初始化与登录

+ (BOOL)initWithSdkAppId:(NSInteger)sdkAppId {
    return [IMBridge initWithSdkAppId:sdkAppId];
}

+ (BOOL)isInitialized {
    return [IMBridge isInitialized];
}

+ (BOOL)login:(NSString *)userId userSig:(NSString *)userSig {
    return [IMBridge login:userId userSig:userSig];
}

+ (BOOL)logout {
    return [IMBridge logout];
}

+ (BOOL)isLoggedIn {
    return [IMBridge isLoggedIn];
}

+ (NSString *)getCurrentUserId {
    return [IMBridge getCurrentUserId];
}

#pragma mark - 消息发送

+ (NSString *)sendTextMessage:(NSString *)toUserId text:(NSString *)text {
    return [IMBridge sendTextMessage:toUserId text:text];
}

+ (NSString *)sendImageMessage:(NSString *)toUserId imagePath:(NSString *)imagePath {
    return [IMBridge sendImageMessage:toUserId imagePath:imagePath];
}

+ (NSString *)sendVideoMessage:(NSString *)toUserId videoPath:(NSString *)videoPath videoType:(NSInteger)videoType duration:(NSInteger)duration snapshotPath:(NSString *)snapshotPath {
    return [IMBridge sendVideoMessage:toUserId videoPath:videoPath videoType:videoType duration:duration snapshotPath:snapshotPath];
}

+ (NSString *)sendVoiceMessage:(NSString *)toUserId voicePath:(NSString *)voicePath duration:(NSInteger)duration {
    return [IMBridge sendVoiceMessage:toUserId voicePath:voicePath duration:duration];
}

+ (NSString *)sendCustomMessage:(NSString *)toUserId data:(NSString *)data desc:(NSString *)desc extension:(NSString *)extension {
    return [IMBridge sendCustomMessage:toUserId data:data desc:desc extension:extension];
}

#pragma mark - 消息历史记录

+ (void)getC2CMessageList:(NSString *)peerUserId count:(NSInteger)count lastMsgId:(NSString *)lastMsgId onItem:(void (^)(NSString *, NSString *, NSInteger, NSString *, NSString *, long long, BOOL))onItem onComplete:(void (^)(NSInteger, NSString *))onComplete {
    [IMBridge getC2CMessageList:peerUserId count:count lastMsgId:lastMsgId onItem:onItem onComplete:onComplete];
}

+ (void)loadMessages:(NSString *)peerUserId count:(NSInteger)count onItem:(void (^)(NSString *, NSString *, NSInteger, NSString *, NSString *, long long, BOOL))onItem onComplete:(void (^)(NSInteger, NSString *))onComplete {
    [IMBridge loadMessages:peerUserId count:count onItem:onItem onComplete:onComplete];
}

#pragma mark - 消息管理

+ (BOOL)deleteMessage:(NSString *)msgId {
    return [IMBridge deleteMessage:msgId];
}

+ (BOOL)revokeMessage:(NSString *)msgId {
    return [IMBridge revokeMessage:msgId];
}

#pragma mark - 已读标记

+ (BOOL)markC2CMessageAsRead:(NSString *)userId {
    return [IMBridge markC2CMessageAsRead:userId];
}

+ (BOOL)markGroupMessageAsRead:(NSString *)groupId {
    return [IMBridge markGroupMessageAsRead:groupId];
}

+ (BOOL)sendMessageReadReceipts:(NSString *)msgIds {
    return [IMBridge sendMessageReadReceipts:msgIds];
}

#pragma mark - 资源释放

+ (void)destroy {
    [IMBridge destroy];
}

@end
