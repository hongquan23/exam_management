from db.session import engine
from db.base import Base   # nơi import toàn bộ models

from models import (
    User,
    Test,
    Section,
    ListeningQuestion,
    ReadingQuestion,
    WritingQuestion,
    SpeakingQuestion,
    DoneTest
)
Base.metadata.drop_all(bind=engine)
print(Base.metadata.tables.keys())

