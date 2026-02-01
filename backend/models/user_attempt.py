from sqlalchemy import Column, Integer, Text, ForeignKey
from db.base import Base
from sqlalchemy.orm import relationship


class UserAttempt(Base):
    __tablename__ = "user_attempt"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("section.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    question_id = Column(Integer, ForeignKey("question_base.id"), unique=True)
    user_ans = Column(Text)
    ai_ans = Column(Text)

    question = relationship("QuestionBase", back_populates="user_attempt")
    user = relationship("User", back_populates="user_attempts")
    section = relationship("Section", back_populates="user_attempts")