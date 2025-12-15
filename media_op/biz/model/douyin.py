# models.py
from sqlalchemy.sql.schema import Column


from sqlalchemy import (
    Column, Integer, Float, 
    Boolean, DateTime, func, 
    UniqueConstraint,
    VARCHAR, Text, String, BigInteger,
    PrimaryKeyConstraint
)
from sqlalchemy.orm import Session
from media_op.biz.db import Base

class DouyinAweme(Base):
    __tablename__ = 'douyin_aweme'
    id = Column(Integer, primary_key=True, comment="")
    user_id = Column(String(255), comment="用户ID")
    sec_uid = Column(String(255), comment="用户加密ID")
    short_user_id = Column(String(255), comment="用户短ID")
    user_unique_id = Column(String(255), comment="用户唯一ID")
    nickname = Column(Text, comment="用户昵称")
    avatar = Column(Text)
    user_signature = Column(Text)
    ip_location = Column(Text)
    add_ts = Column(BigInteger)
    last_modify_ts = Column(BigInteger)
    aweme_id = Column(BigInteger, index=True)
    aweme_type = Column(Text)
    title = Column(Text)
    desc = Column(Text)
    create_time = Column(BigInteger, index=True)
    liked_count = Column(Text)
    comment_count = Column(Text)
    share_count = Column(Text)
    collected_count = Column(Text)
    aweme_url = Column(Text)
    cover_url = Column(Text)
    video_download_url = Column(Text)
    music_download_url = Column(Text)
    note_download_url = Column(Text)
    source_keyword = Column(Text, default='')


class DouyinAwemeSummary(Base):
    """
    抖音视频信息及关联商品信息模型。
    对应 JSON 数据结构，主键为 aweme_id 和 update_ts。
    """
    __tablename__ = 'douyin_aweme_summary'

    # --- 主键字段 ---
    aweme_id = Column(BigInteger, nullable=False, comment="视频ID")
    update_ts = Column(BigInteger, nullable=False, comment="更新时间戳（毫秒）")

    # --- 用户信息 ---
    sec_uid = Column(String(255), nullable=True, comment="用户加密ID")
    nickname = Column(Text, nullable=True, comment="用户昵称")
    avatar: Column[str] = Column(Text, nullable=True, comment="用户头像URL")

    # --- 视频信息 ---
    aweme_type = Column(String(50), nullable=True, comment="视频类型")
    title = Column(Text, nullable=True, comment="视频标题")
    desc = Column(Text, nullable=True, comment="视频描述")
    create_time = Column(BigInteger, nullable=True, comment="创建时间（秒级时间戳）")

    # --- 统计信息 ---
    recommend_count = Column(Integer, nullable=False, default=0, comment="推荐数")
    comment_count = Column(Integer, nullable=False, default=0, comment="评论数")
    digg_count = Column(Integer, nullable=False, default=0, comment="点赞数")
    admire_count = Column(Integer, nullable=False, default=0, comment="喜欢数")
    play_count = Column(Integer, nullable=False, default=0, comment="播放数")
    share_count = Column(Integer, nullable=False, default=0, comment="分享数")
    collect_count = Column(Integer, nullable=False, default=0, comment="收藏数")

    # --- URL 信息 ---
    aweme_url = Column(Text, nullable=True, comment="视频页面URL")
    cover_url = Column(Text, nullable=True, comment="封面图URL")
    video_download_url = Column(Text, nullable=True, comment="视频下载URL")
    music_download_url = Column(Text, nullable=True, comment="音乐下载URL")
    note_download_url = Column(Text, nullable=True, comment="图文下载URL")

    # --- 商品信息 ---
    promotion_id = Column(String(255), nullable=True, comment="推广ID")
    product_id = Column(String(255), nullable=True, comment="商品ID")
    product_title = Column(Text, nullable=True, comment="商品标题")
    price = Column(Integer, nullable=False, default=0, comment="商品价格（单位：分）")
    sales = Column(Integer, nullable=False, default=0, comment="销量")
    elastic_title = Column(Text, nullable=True, comment="商品弹性标题")

    # --- 定义联合主键 ---
    __table_args__ = (
        PrimaryKeyConstraint('aweme_id', 'update_ts'),
        # 可以在这里添加其他索引或约束
        # 例如: Index('idx_create_time', 'create_time'),
    )


class DyCreator(Base):
    __tablename__ = 'dy_creator'
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), comment="用户ID")
    nickname = Column(Text, comment="昵称")
    avatar = Column(Text, comment="头像")
    ip_location = Column(Text, comment="IP位置")
    add_ts = Column(BigInteger, comment="添加时间戳")
    last_modify_ts = Column(BigInteger, comment="最后修改时间戳")
    desc = Column(Text, comment="描述")
    gender = Column(Text, comment="性别")
    follows = Column(Text, comment="关注数")
    fans = Column(Text, comment="粉丝数")
    interaction = Column(Text, comment="互动数")
    videos_count = Column(String(255), comment="发布视频数")
