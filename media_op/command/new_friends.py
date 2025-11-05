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
    wx_auto_svc.add_new_friends()    


if __name__ == "__main__":
    extract_product()
