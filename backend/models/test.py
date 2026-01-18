from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base

class Test(Base):
    __tablename__ = "test"

    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    year = Column(Integer)
    time_limit = Column(Integer)

    sections = relationship("Section", back_populates="test", cascade="all, delete")
