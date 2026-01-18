from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.section import SectionCreate, SectionOut
from crud import section as section_crud

router = APIRouter()

@router.post("/test/{test_id}", response_model=SectionOut)
def create_section(
    test_id: int,
    section_in: SectionCreate,
    db: Session = Depends(get_db)
):
    return section_crud.create(db, test_id, section_in)


@router.get("/test/{test_id}", response_model=list[SectionOut])
def get_sections_by_test(test_id: int, db: Session = Depends(get_db)):
    return section_crud.get_by_test(db, test_id)
