from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.section import SectionCreate, SectionOut
from crud import section as section_crud

router = APIRouter()

@router.post("/create", response_model=SectionOut)
def create_section(
    section_in: SectionCreate,
    db: Session = Depends(get_db)
):
    return section_crud.create(db, section_in)

@router.get("/", response_model=list[SectionOut])
def get_sections(skill: str | None = None, db: Session = Depends(get_db)):
    if skill:
        return section_crud.get_by_skill(db, skill)
    return section_crud.get_all(db)

@router.delete("/{section_id}")
def delete_section(section_id: int, db: Session = Depends(get_db)):
    return section_crud.delete(db, section_id)
