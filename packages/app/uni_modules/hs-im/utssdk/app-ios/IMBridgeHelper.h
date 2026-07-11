// ========== hs-im iOS UTS 桥接辅助类 ==========
// 提供 @objc 方法供 UTS 层调用
// 桥接 IMBridge OC 类到 UTS

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface IMBridgeHelper : NSObject

/// 单例
+ (instancetype)sharedInstance;

#pragma mark - 回调设置

+ (void)setOnLoginSuccess:(nullable void (^)(void))callback;
+ (void)setOnLoginFailed:(nullable void (^)(NSInteger code, NSString *desc))callback;
+ (void)setOnLogoutSuccess:(nullable void (^)(void))callback;
+ (void)setOnKickedOffline:(nullable void (^)(void))callback;
+ (void)setOnUserSigExpired:(nullable void (^)(void))callback;
+ (void)setOnConnecting:(nullable void (^)(void))callback;
+ (void)setOnConnectSuccess:(nullable void (^)(void))callback;
+ (void)setOnConnectFailed:(nullable void (^)(NSInteger code, NSString *desc))callback;
+ (void)setOnMessageReceived:(nullable void (^)(NSString *msgId, NSString *sender, NSInteger type, NSString *text, NSString *extra, long long timestamp, BOOL isSelf))callback;
+ (void)setOnMessageRevoked:(nullable void (^)(NSString *msgId))callback;

#pragma mark - 初始化与登录

+ (BOOL)initWithSdkAppId:(NSInteger)sdkAppId;
+ (BOOL)isInitialized;
+ (BOOL)login:(NSString *)userId userSig:(NSString *)userSig;
+ (BOOL)logout;
+ (BOOL)isLoggedIn;
+ (nullable NSString *)getCurrentUserId;

#pragma mark - 消息发送

+ (NSString *)sendTextMessage:(NSString *)toUserId text:(NSString *)text;
+ (NSString *)sendImageMessage:(NSString *)toUserId imagePath:(NSString *)imagePath;
+ (NSString *)sendVideoMessage:(NSString *)toUserId videoPath:(NSString *)videoPath videoType:(NSInteger)videoType duration:(NSInteger)duration snapshotPath:(NSString *)snapshotPath;
+ (NSString *)sendVoiceMessage:(NSString *)toUserId voicePath:(NSString *)voicePath duration:(NSInteger)duration;
+ (NSString *)sendCustomMessage:(NSString *)toUserId data:(NSString *)data desc:(NSString *)desc extension:(NSString *)extension;

#pragma mark - 消息历史记录

+ (void)getC2CMessageList:(NSString *)peerUserId count:(NSInteger)count lastMsgId:(NSString *)lastMsgId onItem:(nullable void (^)(NSString *msgId, NSString *sender, NSInteger type, NSString *text, NSString *extra, long long timestamp, BOOL isSelf))onItem onComplete:(nullable void (^)(NSInteger total, NSString *error))onComplete;

+ (void)loadMessages:(NSString *)peerUserId count:(NSInteger)count onItem:(nullable void (^)(NSString *msgId, NSString *sender, NSInteger type, NSString *text, NSString *extra, long long timestamp, BOOL isSelf))onItem onComplete:(nullable void (^)(NSInteger total, NSString *error))onComplete;

#pragma mark - 消息管理

+ (BOOL)deleteMessage:(NSString *)msgId;
+ (BOOL)revokeMessage:(NSString *)msgId;

#pragma mark - 已读标记

+ (BOOL)markC2CMessageAsRead:(NSString *)userId;
+ (BOOL)markGroupMessageAsRead:(NSString *)groupId;
+ (BOOL)sendMessageReadReceipts:(NSString *)msgIds;

#pragma mark - 资源释放

+ (void)destroy;

@end

NS_ASSUME_NONNULL_END
