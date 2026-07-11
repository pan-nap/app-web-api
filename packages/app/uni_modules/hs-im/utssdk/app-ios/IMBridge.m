// ========== hs-im iOS TencentCloudIM 桥接实现 ==========
// 对应 Android 端 IMBridge.kt

#import "IMBridge.h"
#import <TencentCloudIM/TencentCloudIM.h>

#pragma mark - 全局变量

static BOOL _isInitialized = NO;
static BOOL _isLoggedIn = NO;
static NSString *_currentUserId = @"";

// 消息缓存
static NSMutableDictionary<NSString *, V2TIMMessage *> *_messageCache;
static NSMutableArray<V2TIMMessage *> *_localMessages;
static NSMutableDictionary<NSString *, V2TIMMessage *> *_lastMsgForPagination;

#pragma mark - 回调

static IMSimpleCallback _onLoginSuccess;
static IMErrorCallback _onLoginFailed;
static IMSimpleCallback _onLogoutSuccess;
static IMSimpleCallback _onKickedOffline;
static IMSimpleCallback _onUserSigExpired;
static IMSimpleCallback _onConnecting;
static IMSimpleCallback _onConnectSuccess;
static IMErrorCallback _onConnectFailed;
static void (^_onMessageReceived)(NSString *, NSString *, NSInteger, NSString *, NSString *, long long, BOOL);
static void (^_onMessageRevoked)(NSString *);

#pragma mark - 工具方法

+ (IMMessageType)getMessageType:(V2TIMMessage *)msg {
    if (msg.textElem != nil) return IMMessageTypeText;
    if (msg.imageElem != nil) return IMMessageTypeImage;
    if (msg.videoElem != nil) return IMMessageTypeVideo;
    if (msg.soundElem != nil) return IMMessageTypeVoice;
    if (msg.customElem != nil) return IMMessageTypeCustom;
    return IMMessageTypeText;
}

+ (NSString *)getMessageText:(V2TIMMessage *)msg {
    return msg.textElem.text ?: @"";
}

+ (NSString *)getMessageExtra:(V2TIMMessage *)msg {
    if (msg.imageElem != nil) {
        return msg.imageElem.path ?: @"";
    }
    if (msg.videoElem != nil) {
        V2TIMVideoElem *video = msg.videoElem;
        return [NSString stringWithFormat:@"%@|%@|%ld", video.videoPath ?: @"", video.snapshotPath ?: @"", (long)video.duration];
    }
    if (msg.soundElem != nil) {
        V2TIMSoundElem *sound = msg.soundElem;
        return [NSString stringWithFormat:@"%@|%ld", sound.soundPath ?: @"", (long)sound.duration];
    }
    if (msg.customElem != nil) {
        NSData *data = msg.customElem.data;
        if (data != nil) {
            return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        }
    }
    return @"";
}

+ (void)cacheMessage:(V2TIMMessage *)msg {
    if (msg.msgID == nil) return;
    _messageCache[msg.msgID] = msg;
    [_localMessages addObject:msg];
}

#pragma mark - 回调设置

+ (void)setOnLoginSuccess:(IMSimpleCallback)callback {
    _onLoginSuccess = [callback copy];
}

+ (void)setOnLoginFailed:(IMErrorCallback)callback {
    _onLoginFailed = [callback copy];
}

+ (void)setOnLogoutSuccess:(IMSimpleCallback)callback {
    _onLogoutSuccess = [callback copy];
}

+ (void)setOnKickedOffline:(IMSimpleCallback)callback {
    _onKickedOffline = [callback copy];
}

+ (void)setOnUserSigExpired:(IMSimpleCallback)callback {
    _onUserSigExpired = [callback copy];
}

+ (void)setOnConnecting:(IMSimpleCallback)callback {
    _onConnecting = [callback copy];
}

+ (void)setOnConnectSuccess:(IMSimpleCallback)callback {
    _onConnectSuccess = [callback copy];
}

+ (void)setOnConnectFailed:(IMErrorCallback)callback {
    _onConnectFailed = [callback copy];
}

+ (void)setOnMessageReceived:(void (^)(NSString *, NSString *, NSInteger, NSString *, NSString *, long long, BOOL))callback {
    _onMessageReceived = [callback copy];
}

+ (void)setOnMessageRevoked:(void (^)(NSString *))callback {
    _onMessageRevoked = [callback copy];
}

#pragma mark - 初始化与登录

+ (BOOL)initWithSdkAppId:(NSInteger)sdkAppId {
    if (_isInitialized) {
        NSLog(@"IMBridge: 已初始化，跳过");
        return YES;
    }
    
    // 初始化缓存
    _messageCache = [NSMutableDictionary dictionary];
    _localMessages = [NSMutableArray array];
    _lastMsgForPagination = [NSMutableDictionary dictionary];
    
    // 初始化 SDK
    V2TIMSDKConfig *config = [[V2TIMSDKConfig alloc] init];
    config.logLevel = V2TIM_LOG_INFO;
    
    BOOL result = [[V2TIMManager sharedInstance] initSDK:(int)sdkAppId config:config listener:^(V2TIMConnectionListener *listener) {
        // 连接状态监听
        [listener onConnecting];
        dispatch_async(dispatch_get_main_queue(), ^{
            if (_onConnecting) _onConnecting();
        });
    }];
    
    if (result) {
        _isInitialized = YES;
        [self registerListeners];
        NSLog(@"IMBridge: init 结果=%d, sdkAppId=%ld", result, (long)sdkAppId);
    } else {
        NSLog(@"IMBridge: init 失败");
    }
    
    return result;
}

+ (BOOL)isInitialized {
    return _isInitialized;
}

+ (void)registerListeners {
    // 消息监听
    [[V2TIMManager sharedInstance] addSimpleMsgListener:self];
    NSLog(@"IMBridge: 消息监听器已注册");
}

+ (BOOL)login:(NSString *)userId userSig:(NSString *)userSig {
    if (!_isInitialized) {
        NSLog(@"IMBridge: 未初始化");
        return NO;
    }
    
    if (_isLoggedIn) {
        [[V2TIMManager sharedInstance] logout:nil fail:nil];
        _isLoggedIn = NO;
        _currentUserId = @"";
    }
    
    [[V2TIMManager sharedInstance] login:userId userSig:userSig succ:^{
        NSLog(@"IMBridge: 登录成功 userId=%@", userId);
        _isLoggedIn = YES;
        _currentUserId = userId;
        dispatch_async(dispatch_get_main_queue(), ^{
            if (_onLoginSuccess) _onLoginSuccess();
        });
    } fail:^(int code, NSString *desc) {
        NSLog(@"IMBridge: 登录失败 code=%d, desc=%@", code, desc);
        dispatch_async(dispatch_get_main_queue(), ^{
            if (_onLoginFailed) _onLoginFailed(code, desc);
        });
    }];
    
    return YES;
}

+ (BOOL)logout {
    if (!_isInitialized) return NO;
    
    [[V2TIMManager sharedInstance] logout:^{
        NSLog(@"IMBridge: 登出成功");
        _isLoggedIn = NO;
        _currentUserId = @"";
        dispatch_async(dispatch_get_main_queue(), ^{
            if (_onLogoutSuccess) _onLogoutSuccess();
        });
    } fail:^(int code, NSString *desc) {
        _isLoggedIn = NO;
        _currentUserId = @"";
        dispatch_async(dispatch_get_main_queue(), ^{
            if (_onLogoutSuccess) _onLogoutSuccess();
        });
    }];
    
    return YES;
}

+ (BOOL)isLoggedIn {
    return _isLoggedIn;
}

+ (NSString *)getCurrentUserId {
    return _currentUserId;
}

#pragma mark - 消息发送

+ (NSString *)sendMessageInternal:(V2TIMMessage *)msg toUserId:(NSString *)toUserId {
    if (msg == nil || !_isLoggedIn) return @"";
    
    NSString *msgId = msg.msgID ?: @"";
    [self cacheMessage:msg];
    
    [[V2TIMManager sharedInstance] sendMessage:msg to:toUserId receiver:nil groupID:nil priority:V2TIM_PRIORITY_DEFAULT onlineUserOnly:NO offlinePushInfo:nil progress:nil succ:^{
        NSLog(@"IMBridge: 消息发送成功 msgId=%@", msgId);
    } fail:^(int code, NSString *desc) {
        NSLog(@"IMBridge: 消息发送失败 code=%d, desc=%@", code, desc);
    }];
    
    return msgId;
}

+ (NSString *)sendTextMessage:(NSString *)toUserId text:(NSString *)text {
    if (text.length == 0) return @"";
    
    V2TIMMessage *msg = [[V2TIMManager sharedInstance] createTextMessage:text];
    NSLog(@"IMBridge: 发送文本消息 to=%@, text=%@", toUserId, text);
    return [self sendMessageInternal:msg toUserId:toUserId];
}

+ (NSString *)sendImageMessage:(NSString *)toUserId imagePath:(NSString *)imagePath {
    if (imagePath.length == 0) return @"";
    
    V2TIMMessage *msg = [[V2TIMManager sharedInstance] createImageMessage:imagePath];
    NSLog(@"IMBridge: 发送图片消息 to=%@, path=%@", toUserId, imagePath);
    return [self sendMessageInternal:msg toUserId:toUserId];
}

+ (NSString *)sendVideoMessage:(NSString *)toUserId videoPath:(NSString *)videoPath videoType:(NSInteger)videoType duration:(NSInteger)duration snapshotPath:(NSString *)snapshotPath {
    if (videoPath.length == 0) return @"";
    
    V2TIMMessage *msg = [[V2TIMManager sharedInstance] createVideoMessage:videoPath type:(int)videoType duration:(int)duration snapshotPath:snapshotPath];
    NSLog(@"IMBridge: 发送视频消息 to=%@, path=%@", toUserId, videoPath);
    return [self sendMessageInternal:msg toUserId:toUserId];
}

+ (NSString *)sendVoiceMessage:(NSString *)toUserId voicePath:(NSString *)voicePath duration:(NSInteger)duration {
    if (voicePath.length == 0) return @"";
    
    V2TIMMessage *msg = [[V2TIMManager sharedInstance] createSoundMessage:voicePath duration:(int)duration];
    NSLog(@"IMBridge: 发送语音消息 to=%@, path=%@", toUserId, voicePath);
    return [self sendMessageInternal:msg toUserId:toUserId];
}

+ (NSString *)sendCustomMessage:(NSString *)toUserId data:(NSString *)data desc:(NSString *)desc extension:(NSString *)extension {
    // 使用 createCustomMessage
    NSData *customData = [data dataUsingEncoding:NSUTF8StringEncoding];
    V2TIMMessage *msg = [[V2TIMManager sharedInstance] createCustomMessage:customData desc:desc extension:extension];
    NSLog(@"IMBridge: 发送自定义消息 to=%@, desc=%@", toUserId, desc);
    return [self sendMessageInternal:msg toUserId:toUserId];
}

#pragma mark - 消息历史记录

+ (void)getC2CMessageList:(NSString *)peerUserId
                    count:(NSInteger)count
                lastMsgId:(NSString *)lastMsgId
                   onItem:(IMSingleMessageBlock)onItem
               onComplete:(IMMessageListCompleteBlock)onComplete {
    if (!_isInitialized) {
        if (onComplete) onComplete(0, @"未初始化");
        return;
    }
    if (!_isLoggedIn) {
        if (onComplete) onComplete(0, @"未登录");
        return;
    }
    
    V2TIMMessage *lastMsg = nil;
    if (lastMsgId.length > 0) {
        lastMsg = _messageCache[lastMsgId];
    }
    
    [[V2TIMManager sharedInstance] getC2CHistoryMessageList:peerUserId count:(int)count lastMsgID:lastMsg succ:^(NSArray<V2TIMMessage *> *list) {
        if (list == nil || list.count == 0) {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (onComplete) onComplete(0, @"");
            });
            return;
        }
        
        for (V2TIMMessage *msg in list) {
            [self cacheMessage:msg];
            if (onItem) {
                NSString *msgId = msg.msgID ?: @"";
                NSString *sender = msg.sender ?: @"";
                NSInteger type = [self getMessageType:msg];
                NSString *text = [self getMessageText:msg];
                NSString *extra = [self getMessageExtra:msg];
                long long ts = msg.timestamp;
                BOOL isSelf = [sender isEqualToString:_currentUserId];
                dispatch_async(dispatch_get_main_queue(), ^{
                    onItem(msgId, sender, type, text, extra, ts, isSelf);
                });
            }
        }
        
        // 更新分页游标
        V2TIMMessage *last = list.lastObject;
        if (last != nil) {
            _lastMsgForPagination[peerUserId] = last;
        }
        
        NSLog(@"IMBridge: getC2CMessageList 返回 %lu 条", (unsigned long)list.count);
        dispatch_async(dispatch_get_main_queue(), ^{
            if (onComplete) onComplete((NSInteger)list.count, @"");
        });
    } fail:^(int code, NSString *desc) {
        NSLog(@"IMBridge: getC2CMessageList 失败 code=%d", code);
        dispatch_async(dispatch_get_main_queue(), ^{
            if (onComplete) onComplete(0, desc ?: @"未知错误");
        });
    }];
}

+ (void)loadMessages:(NSString *)peerUserId
              count:(NSInteger)count
             onItem:(IMSingleMessageBlock)onItem
         onComplete:(IMMessageListCompleteBlock)onComplete {
    if (!_isInitialized) {
        if (onComplete) onComplete(0, @"未初始化");
        return;
    }
    if (!_isLoggedIn) {
        if (onComplete) onComplete(0, @"未登录");
        return;
    }
    
    NSMutableArray<V2TIMMessage *> *matched = [NSMutableArray array];
    for (V2TIMMessage *msg in _localMessages) {
        NSString *sender = msg.sender ?: @"";
        NSString *receiver = msg.groupID ?: @"";
        BOOL isPeerMsg = [sender isEqualToString:peerUserId] || ([sender isEqualToString:_currentUserId] && [receiver isEqualToString:peerUserId]);
        if (isPeerMsg) {
            [matched addObject:msg];
        }
    }
    
    NSArray<V2TIMMessage *> *result = matched;
    if (matched.count > count) {
        result = [matched subarrayWithRange:NSMakeRange(matched.count - count, count)];
    }
    
    for (V2TIMMessage *msg in result) {
        if (onItem) {
            NSString *msgId = msg.msgID ?: @"";
            NSString *sender = msg.sender ?: @"";
            NSInteger type = [self getMessageType:msg];
            NSString *text = [self getMessageText:msg];
            NSString *extra = [self getMessageExtra:msg];
            long long ts = msg.timestamp;
            BOOL isSelf = [sender isEqualToString:_currentUserId];
            dispatch_async(dispatch_get_main_queue(), ^{
                onItem(msgId, sender, type, text, extra, ts, isSelf);
            });
        }
    }
    
    NSLog(@"IMBridge: loadMessages 返回本地消息 %lu 条", (unsigned long)result.count);
    if (onComplete) {
        dispatch_async(dispatch_get_main_queue(), ^{
            onComplete((NSInteger)result.count, @"");
        });
    }
}

#pragma mark - 消息管理

+ (BOOL)deleteMessage:(NSString *)msgId {
    V2TIMMessage *msg = _messageCache[msgId];
    if (msg == nil) return NO;
    
    [[V2TIMManager sharedInstance] deleteMessage:msg succ:^{
        NSLog(@"IMBridge: 消息删除成功 msgId=%@", msgId);
        [_messageCache removeObjectForKey:msgId];
        [_localMessages removeObject:msg];
    } fail:^(int code, NSString *desc) {
        NSLog(@"IMBridge: 消息删除失败 code=%d", code);
    }];
    
    return YES;
}

+ (BOOL)revokeMessage:(NSString *)msgId {
    V2TIMMessage *msg = _messageCache[msgId];
    if (msg == nil) return NO;
    
    [[V2TIMManager sharedInstance] revokeMessage:msg succ:^{
        NSLog(@"IMBridge: 消息撤回成功 msgId=%@", msgId);
    } fail:^(int code, NSString *desc) {
        NSLog(@"IMBridge: 消息撤回失败 code=%d", code);
    }];
    
    return YES;
}

#pragma mark - 已读标记

+ (BOOL)markC2CMessageAsRead:(NSString *)userId {
    if (!_isInitialized) return NO;
    
    [[V2TIMManager sharedInstance] markC2CMessageAsRead:userId succ:^{
        NSLog(@"IMBridge: 单聊已读标记成功 userId=%@", userId);
    } fail:^(int code, NSString *desc) {
        NSLog(@"IMBridge: 单聊已读标记失败 code=%d", code);
    }];
    
    return YES;
}

+ (BOOL)markGroupMessageAsRead:(NSString *)groupId {
    if (!_isInitialized) return NO;
    
    [[V2TIMManager sharedInstance] markGroupMessageAsRead:groupId succ:^{
        NSLog(@"IMBridge: 群聊已读标记成功 groupId=%@", groupId);
    } fail:^(int code, NSString *desc) {
        NSLog(@"IMBridge: 群聊已读标记失败 code=%d", code);
    }];
    
    return YES;
}

+ (BOOL)sendMessageReadReceipts:(NSString *)msgIds {
    NSArray<NSString *> *ids = [msgIds componentsSeparatedByString:@","];
    NSMutableArray<V2TIMMessage *> *msgs = [NSMutableArray array];
    for (NSString *mid in ids) {
        NSString *trimmed = [mid stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
        if (trimmed.length > 0) {
            V2TIMMessage *msg = _messageCache[trimmed];
            if (msg != nil) {
                [msgs addObject:msg];
            }
        }
    }
    
    if (msgs.count == 0) return NO;
    
    [[V2TIMManager sharedInstance] sendMessageReadReceipts:msgs succ:^{
        NSLog(@"IMBridge: 已读回执发送成功");
    } fail:^(int code, NSString *desc) {
        NSLog(@"IMBridge: 已读回执发送失败");
    }];
    
    return YES;
}

#pragma mark - 资源释放

+ (void)destroy {
    if (_isInitialized) {
        [[V2TIMManager sharedInstance] logout:nil fail:nil];
        [[V2TIMManager sharedInstance] unInitSDK];
    }
    
    _onLoginSuccess = nil;
    _onLoginFailed = nil;
    _onLogoutSuccess = nil;
    _onKickedOffline = nil;
    _onUserSigExpired = nil;
    _onConnecting = nil;
    _onConnectSuccess = nil;
    _onConnectFailed = nil;
    _onMessageReceived = nil;
    _onMessageRevoked = nil;
    
    _isInitialized = NO;
    _isLoggedIn = NO;
    _currentUserId = @"";
    [_messageCache removeAllObjects];
    [_localMessages removeAllObjects];
    [_lastMsgForPagination removeAllObjects];
    
    NSLog(@"IMBridge: 已销毁");
}

#pragma mark - V2TIMSimpleMsgListener 回调

+ (void)onRecvNewMessage:(V2TIMMessage *)msg {
    NSString *msgId = msg.msgID ?: @"";
    NSString *sender = msg.sender ?: @"";
    NSInteger type = [self getMessageType:msg];
    NSString *text = [self getMessageText:msg];
    NSString *extra = [self getMessageExtra:msg];
    long long ts = msg.timestamp;
    BOOL isSelf = [sender isEqualToString:_currentUserId];
    
    NSLog(@"IMBridge: 收到消息 msgId=%@, from=%@, type=%ld", msgId, sender, (long)type);
    [self cacheMessage:msg];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        if (_onMessageReceived) _onMessageReceived(msgId, sender, type, text, extra, ts, isSelf);
    });
}

+ (void)onRecvMessageRevoked:(NSString *)msgID {
    NSLog(@"IMBridge: 消息被撤回 msgId=%@", msgID);
    dispatch_async(dispatch_get_main_queue(), ^{
        if (_onMessageRevoked) _onMessageRevoked(msgID);
    });
}

@end
