from sqlalchemy import Column, Integer, Text, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class ReadingQuestion(Base):
    __tablename__ = "reading_question"

    id = Column(Integer, primary_key=True)
    passage = Column(Text)
    question = Column(Text)

    option_a = Column(Text)
    option_b = Column(Text)
    option_c = Column(Text)
    option_d = Column(Text)

    correct_answer = Column(String(1))
    
    question_base = relationship("QuestionBase", back_populates="reading_question", uselist=False)
  