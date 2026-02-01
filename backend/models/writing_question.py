from sqlalchemy import Column, Integer, Text, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class WritingQuestion(Base):
    __tablename__ = "writing_question"

    id = Column(Integer, primary_key=True)
    image_url = Column(String(255))
    passage = Column(Text)
    question = Column(Text)
    sample_answer = Column(Text)
    image_describe = Column(Text)
   
    question_base = relationship("QuestionBase", back_populates="writing_question", uselist=False)
 