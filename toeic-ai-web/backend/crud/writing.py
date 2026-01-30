from sqlalchemy.orm import Session
from models.writing_question import WritingQuestion

def get_by_section(db: Session, section_id: int):
    return db.query(WritingQuestion)\
        .filter(WritingQuestion.section_id == section_id)\
        .all()

def create(db: Session, data: dict):
    q = WritingQuestion(**data)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q
