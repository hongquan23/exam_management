from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class Section(Base):
    __tablename__ = "section"

    id = Column(Integer, primary_key=True)
    skill = Column(String(50))   # listening / reading / writing / speaking
    part = Column(Integer)
    time_limit = Column(Integer)

    user_attempts = relationship("UserAttempt", back_populates="section")

    listening_questions = relationship("ListeningQuestion", back_populates="section")
    reading_questions = relationship("ReadingQuestion", back_populates="section")
    writing_questions = relationship("WritingQuestion", back_populates="section")
    speaking_questions = relationship("SpeakingQuestion", back_populates="section")
