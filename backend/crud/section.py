from sqlalchemy.orm import Session
from models.section import Section
from schemas.section import SectionBase

def get_all(db: Session):
    return db.query(Section).all()

def get_by_id(db: Session, section_id: int):
    return db.query(Section).filter(Section.id == section_id).first()

def create(db: Session,  section_in: SectionBase):
    section = Section(**section_in.dict())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section
