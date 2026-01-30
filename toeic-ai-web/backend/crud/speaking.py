from sqlalchemy.orm import Session
from models.speaking_question import SpeakingQuestion

def get_by_section(db: Session, section_id: int):
    return db.query(SpeakingQuestion)\
        .filter(SpeakingQuestion.section_id == section_id)\
        .all()

def create(db: Session, data: dict):
    q = SpeakingQuestion(**data)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q
