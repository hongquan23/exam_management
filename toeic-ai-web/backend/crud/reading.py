from sqlalchemy.orm import Session
from models.reading_question import ReadingQuestion

def get_by_section(db: Session, section_id: int):
    return db.query(ReadingQuestion)\
        .filter(ReadingQuestion.section_id == section_id)\
        .all()

def create(db: Session, data: dict):
    q = ReadingQuestion(**data)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q
