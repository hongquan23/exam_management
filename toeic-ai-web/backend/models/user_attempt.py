from sqlalchemy import Column, Integer, ForeignKey, DateTime,Text
from sqlalchemy.sql import func
from db.base import Base
from sqlalchemy.orm import relationship

class UserAttempt(Base):
    __tablename__ = "user_attempt"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    section_id = Column(Integer, ForeignKey("section.id"))
    reading_question_id = Column(Integer, ForeignKey("reading_question.id"),unique= True)
    writing_question_id = Column(Integer, ForeignKey("writing_question.id"),unique= True)
    speaking_question_id = Column(Integer, ForeignKey("speaking_question.id"),unique= True)
    listening_question_id = Column(Integer, ForeignKey("listening_question.id"),unique= True)
    user_ans = Column(Text)
    AI_ans = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="user_attempts")
    section = relationship("Section", back_populates="user_attempts")
    writing_question = relationship("WritingQuestion", back_populates="user_attempt")
    speaking_question = relationship("SpeakingQuestion", back_populates="user_attempt")
    reading_question = relationship("ReadingQuestion", back_populates="user_attempt")
    listening_question = relationship("ListeningQuestion", back_populates="user_attempt")