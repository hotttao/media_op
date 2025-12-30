"""

"""
import pandas
from media_op.biz.db.mysql import engine
from media_op.biz.db.wx import WX
from media_op.agent.init import llm
from media_op.biz.service.wx_auto import WeixinAutoService
from media_op.internal.wx_auto.type import WxAccount


def extract_product():
    wx_auto_svc = WeixinAutoService(
        llm=llm,
        wx_chat=WX,
        engine=engine
    )

    # 1. 缓存所有商家的微信昵称
    # wx_auto_svc.cache_merchant()

    # 2. 缓存所有商家的聊天记录
    # friends = wx_auto_svc.load_merchant_cache()
    # wx_auto_svc.cache_chat(friends)

    # 3. 从缓存聊天记录解析商家发送的信息
    # friends = wx_auto_svc.load_merchant_cache()
    # wx_auto_svc.extract_merchant_from_cache(friends)

    account = WxAccount(wx_id="橙子一家", nickname="橙子一家", remark="橙子一家")
    chat_info = wx_auto_svc.wx_auto.get_chat_msg(account, more=False)
    for i in chat_info.content:
        print(f"----{i.type}-----")
        if i.type == "image":
            print(i.message.download())
        print(vars(i.message))
    
    # df = pandas.read_csv("z_.csv")
    # accounts = [WxAccount
    # 
    # (**i) for i in df.to_dict("records")]
    # print(accounts)
    # wx_auto_svc.add_tag(accounts, ["商家"])
    # print(wx_auto_svc.get_friends(tag="z"))
    # wx_auto_svc.get_group_msg("爆单🈺9班投流群（爆单10🈷️）")

if __name__ == "__main__":
    extract_product()
