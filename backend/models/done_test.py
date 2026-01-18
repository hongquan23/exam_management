from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from db.base import Base

class DoneTest(Base):
    __tablename__ = "done_test"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    test_id = Column(Integer, ForeignKey("test.id"))
    correct_answer = Column(Integer)
    false_answer = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
