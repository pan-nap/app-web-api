功能点开发概况：
1. 初始化与登录管理
initSDK：初始化 SDK 实例，配置 SDKAppID 与全局监听。
unInitSDK：反初始化 SDK，释放资源。
login：用户登录鉴权（传入 UserID 与 UserSig）。
logout：退出登录。
getLoginStatus：获取当前登录状态（未登录/登录中/已登录/登出中）。
getLoginUser：获取当前登录用户的 UserID。
2. 会话管理
getConversationList：分页拉取会话列表。
getConversation：获取单个会话信息。
getConversationListByConversaionIds：根据会话 ID 列表批量获取会话。
deleteConversation：删除指定会话。
setConversationDraft：设置/取消会话草稿。
markMessageAsRead：标记会话消息为已读。
pinConversation：置顶/取消置顶会话。
setConversationMute：设置会话消息免打扰。
onConversationListUpdated：监听会话列表数据变更回调。
3. 消息收发与处理
sendTextMessage：发送文本消息。
sendImageMessage：发送图片消息（传入本地路径）。
sendVideoMessage：发送视频消息。
sendVoiceMessage：发送语音消息。
sendCustomMessage：发送自定义格式消息。
recvNewMessage：监听接收到的新消息。
getMessageList：分页拉取历史消息列表。
deleteMessageFromLocalStorage：删除本地消息。
revokeMessage：撤回消息（通常限时）。
markC2CMessageAsRead / markGroupMessageAsRead：标记单聊/群聊消息已读。
sendMessageReadReceipts：发送/group已读回执。
4. 群组管理
createGroup：创建群组（指定群名、类型、成员列表）。
joinGroup：主动申请加入群组。
quitGroup：退出群组。
dismissGroup：解散群组（仅群主可操作）。
getGroupList：拉取已加入的群组列表。
getGroupInfo：获取群组资料。
setGroupInfo：修改群组资料（群名/公告/头像等）。
getGroupMemberList：分页获取群成员列表。
getGroupMembersInfo：获取指定的群成员资料。
kickGroupMember：踢出群成员。
setGroupMemberRole：设置群成员角色（管理员/普通成员等）。
onGroupEventListener：监听群组事件（创建/解散/加入/退出等回调）。
5. 用户与资料管理
getUsersInfo：获取指定用户的资料（头像/昵称/签名等）。
setSelfInfo：修改当前登录用户的个人资料。
getUserStatus：获取用户在线状态。
onUserProfileUpdated：监听用户资料变更回调。
6. 关系链管理（好友系统）
addFriend：添加好友（发送好友申请）。
deleteFromFriendList：删除好友。
getFriendList：获取好友列表。
checkFriend：检查指定用户的好友关系。
onFriendApplicationListAdded：监听收到好友申请。
acceptFriendApplication：接受好友申请。
refuseFriendApplication：拒绝好友申请。
7. 离线推送管理
setOfflinePushConfig：配置离线推送（开启/关闭、厂商通道配置等）。
doBackground：App 进入后台时上报，使能离线推送。
doForeground：App 进入前台时上报，关闭离线推送。