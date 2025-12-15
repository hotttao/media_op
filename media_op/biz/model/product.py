# models.py
from sqlalchemy import (
    BigInteger, Column, Integer, Float, 
    Boolean, DateTime, func, 
    UniqueConstraint,
    VARCHAR, String
)
from sqlalchemy.orm import Session
from media_op.biz.db import Base


class Product(Base):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, autoincrement=True)
    brand = Column(VARCHAR(255), nullable=False, comment="品牌名称")
    product_name = Column(VARCHAR(255), nullable=False, comment="产品名称")
    price = Column(Float, nullable=False, comment="售价")
    product_url = Column(VARCHAR(255), nullable=False, comment="产品链接")
    is_promoted = Column(Boolean, default=False, comment="是否投流")
    wx_promot = Column(VARCHAR(255), nullable=True, comment="视频号投流方式")
    rate = Column(Float, nullable=True, comment="佣金比例")
    roi = Column(Float, nullable=True, comment="ROI")
    roi_desc = Column(VARCHAR(255), nullable=True, comment="ROI描述")
    remark = Column(VARCHAR(255), nullable=True, comment="")  # 新增字段
    sample_send = Column(Boolean, default=False, comment="是否寄样")
    track_num = Column(VARCHAR(255), default="", comment="快递单号")
    # 一级类目
    # 二级类目

    # 联合唯一键：(remark, product_url)
    __table_args__ = (UniqueConstraint('remark', 'product_url', 'is_promoted', name='uix_remark_product_promoted'),)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Product(brand='{self.brand}', name='{self.product_name}', price={self.price})>"

    @classmethod
    def create(cls, db: Session, **kwargs):
        """
        封装 insert 操作，创建一个新商品。

        :param db: SQLAlchemy Session
        :param kwargs: Product 模型字段（如 brand, product_name, price 等）
        :return: 创建后的 Product 实例
        """
        # 可以在这里添加参数校验
        if 'brand' not in kwargs or 'product_name' not in kwargs or 'price' not in kwargs or 'product_url' not in kwargs:
            # raise ValueError("Missing required fields: brand, product_name, price, product_url")
            return

        product = cls(**kwargs)
        db.add(product)
        db.flush()  # 立即执行插入，获取 id
        print(f"[Product.create] Created product: {product}")
        return product

    @classmethod
    def upsert_by_remark_and_url(cls, db: Session, **kwargs):
        """
        基于联合唯一键 (remark, product_url) 执行 upsert 操作：
        - 如果存在 matching 记录，则更新非 None 字段
        - 否则创建新记录

        :param db: SQLAlchemy Session
        :param kwargs: Product 模型字段（必须包含 'remark' 和 'product_url'）
        :return: (Product 实例, is_created: bool)
        """
        remark = kwargs.get('remark')
        product_url = kwargs.get('product_url')

        if not remark:
            raise ValueError("Field 'remark' is required for upsert.")
        if not product_url:
            raise ValueError("Field 'product_url' is required for upsert.")

        # 查询是否存在 (remark, product_url) 匹配的记录
        product = db.query(cls).filter(
            cls.remark == remark,
            cls.product_url == product_url
        ).first()

        is_created = False

        if product:
            # 更新已有记录：仅更新非 None 且值不同的字段
            updated_fields = []
            for key, value in kwargs.items():
                if value is not None:
                    current_value = getattr(product, key, None)
                    if value != current_value:
                        setattr(product, key, value)
                        updated_fields.append(key)
            if updated_fields:
                product.updated_at = func.now()  # 确保触发 updated_at 更新
                print(f"[Product.upsert_by_remark_and_url] Updated product: {product}, fields: {updated_fields}")
        else:
            # 创建新商品
            product = cls(**kwargs)
            db.add(product)
            db.flush()
            is_created = True
            print(f"[Product.upsert_by_remark_and_url] Created new product: {product}")

        return product


# class AdRecord(Base):
#     """
#     投流记录
#     """
#     # product_url
#     # remark
#     # 物流号
#     # 平台
#     # video_url
#     # 投流金额


class ProductInfo(Base):
    __tablename__ = 'product_info'
    
    # 根据注释定义字段
    id = Column(BigInteger, primary_key=True, autoincrement=True, comment="自增ID")
    product_id = Column(String(255), nullable=True, comment="商品ID")
    title = Column(VARCHAR(255), nullable=True, comment="商品标题")
    brand = Column(VARCHAR(255), nullable=True, comment="品牌")
    category = Column(VARCHAR(255), nullable=True, comment="一级分类")
    category2 = Column(VARCHAR(255), nullable=True, comment="二级分类")
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<ProductInfo(id={self.id}, product_id={self.product_id}, title='{self.title}')>"

    # 添加唯一约束：remark 唯一
    __table_args__ = (
        UniqueConstraint('product_id', name='uix_product_id'),
    )

    
    @classmethod
    def create(cls, db: Session, **kwargs):
        """
        封装 insert 操作，创建一个新的商品信息记录。

        :param db: SQLAlchemy Session
        :param kwargs: ProductInfo 模型字段
        :return: 创建后的 ProductInfo 实例
        """
        # 参数校验
        if 'product_id' not in kwargs:
            raise ValueError("Missing required field: product_id")
            
        product_info = cls(**kwargs)
        db.add(product_info)
        db.flush()  # 立即执行插入，获取 id
        print(f"[ProductInfo.create] Created product info: {product_info}")
        return product_info
    
    @classmethod
    def upsert_by_product_id(cls, db: Session, **kwargs):
        """
        基于 product_id 执行 upsert 操作：
        - 如果存在 matching 记录，则更新非 None 字段
        - 否则创建新记录

        :param db: SQLAlchemy Session
        :param kwargs: ProductInfo 模型字段（必须包含 'product_id'）
        :return: (ProductInfo 实例, is_created: bool)
        """
        product_id = kwargs.get('product_id')
        
        if not product_id:
            raise ValueError("Field 'product_id' is required for upsert.")
            
        # 查询是否存在 product_id 匹配的记录
        product_info = db.query(cls).filter(cls.product_id == product_id).first()
        
        is_created = False
        
        if product_info:
            # 更新已有记录：仅更新非 None 且值不同的字段
            updated_fields = []
            for key, value in kwargs.items():
                if value is not None:
                    current_value = getattr(product_info, key, None)
                    if value != current_value:
                        setattr(product_info, key, value)
                        updated_fields.append(key)
            if updated_fields:
                product_info.updated_at = func.now()  # 确保触发 updated_at 更新
                print(f"[ProductInfo.upsert_by_product_id] Updated product info: {product_info}, fields: {updated_fields}")
        else:
            # 创建新记录
            product_info = cls(**kwargs)
            db.add(product_info)
            db.flush()
            is_created = True
            print(f"[ProductInfo.upsert_by_product_id] Created new product info: {product_info}")
            
        return product_info
