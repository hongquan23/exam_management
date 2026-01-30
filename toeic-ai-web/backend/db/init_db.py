
from sqlalchemy.orm import Session
from db.session import engine
from db.base import Base

# Import ALL models để Base biết
from models import (
    User,
    UserAttempt,
    Section,
    ListeningQuestion,
    ReadingQuestion,
    WritingQuestion,
    SpeakingQuestion,
    
)

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()