from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.reading import ReadingQuestionCreate, ReadingQuestionOut
from crud import reading as reading_crud

router = APIRouter(
)


@router.post(
    "/section/{section_id}",
    response_model=ReadingQuestionOut
)
def create_reading_question(
    section_id: int,
    q: ReadingQuestionCreate,
    db: Session = Depends(get_db)
):
    return reading_crud.create(
        db=db,
        data=q.dict(),
        section_id=section_id
    )


@router.get(
    "/section/{section_id}",
    response_model=list[ReadingQuestionOut]
)
def get_reading_questions(
    section_id: int,
    db: Session = Depends(get_db)
):
    return reading_crud.get_by_section(db, section_id)
