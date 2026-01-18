from sqlalchemy.orm import Session
from models.section import Section
from schemas.section import SectionBase

def get_by_test(db: Session, test_id: int):
    return db.query(Section).filter(Section.test_id == test_id).all()

def get_by_id(db: Session, section_id: int):
    return db.query(Section).filter(Section.id == section_id).first()

def create(db: Session, test_id: int, section_in: SectionBase):
    section = Section(test_id=test_id, **section_in.dict())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section
