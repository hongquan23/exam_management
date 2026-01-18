from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class Section(Base):
    __tablename__ = "section"

    id = Column(Integer, primary_key=True)
    test_id = Column(Integer, ForeignKey("test.id"))
    skill = Column(String(50))   # listening / reading / writing / speaking
    part = Column(Integer)
    time_limit = Column(Integer)

    test = relationship("Test", back_populates="sections")

    listening_questions = relationship("ListeningQuestion", back_populates="section")
    reading_questions = relationship("ReadingQuestion", back_populates="section")
    writing_questions = relationship("WritingQuestion", back_populates="section")
    speaking_questions = relationship("SpeakingQuestion", back_populates="section")
