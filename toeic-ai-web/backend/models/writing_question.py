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
    section_id = Column(Integer, ForeignKey("section.id"))

    section = relationship("Section", back_populates="writing_questions")
    user_attempt = relationship("UserAttempt", back_populates="writing_question")