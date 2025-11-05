from media_op.biz.db.mysql import engine, Base
Base.metadata.create_all(bind=engine)