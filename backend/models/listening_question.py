from sqlalchemy import Column, Integer, Text, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class ListeningQuestion(Base):
    __tablename__ = "listening_question"

    id = Column(Integer, primary_key=True)
    passage = Column(Text)
    question = Column(Text)
    audio_url = Column(String(255))
    image_url = Column(String(255))

    option_a = Column(Text)
    option_b = Column(Text)
    option_c = Column(Text)
    option_d = Column(Text)

    correct_answer = Column(String(1))
    section_id = Column(Integer, ForeignKey("section.id"))

    section = relationship("Section", back_populates="listening_questions")
    user_attempt = relationship("UserAttempt", back_populates="listening_question")