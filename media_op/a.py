from wxautox4 import WeChat
from wxautox4.msgs import FriendMessage
import time

wx = WeChat()

# 消息处理函数
def on_message(msg, chat):
    """消息回调函数"""
    print(f'收到来自 {chat} 的消息: {msg.content} {msg.type}', flush=True)
    if msg.type == "image":
        print(msg.download())
    # 自动回复好友的消息，过滤自己的消息
    # if isinstance(msg, FriendMessage):
    #     chat.SendMsg('收到')

# 添加消息监听
wx.AddListenChat('橙子一家', on_message)

# 保持运行
wx.KeepRunning()