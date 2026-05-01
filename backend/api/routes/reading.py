from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.deps import get_db
from models.section import Section
from schemas.reading import ReadingQuestionCreate, ReadingQuestionOut, ReadingBulkUpload
from crud import reading as reading_crud

router = APIRouter()


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


@router.post("/upload-json")
def upload_reading_json(
    data: ReadingBulkUpload,
    db: Session = Depends(get_db)
):
    section = Section(skill="reading", time_limit=data.time_limit, name=data.title)
    db.add(section)
    db.flush()

    questions = reading_crud.create_bulk(
        db=db,
        questions=[q.dict() for q in data.questions],
        section_id=section.id
    )
    return {"section_id": section.id, "count": len(questions), "message": "Upload thành công"}


@router.get(
    "/section/{section_id}",
    response_model=list[ReadingQuestionOut]
)
def get_reading_questions(
    section_id: int,
    db: Session = Depends(get_db)
):
    return reading_crud.get_by_section(db, section_id)


@router.delete("/{question_id}")
def delete_reading_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    q = reading_crud.delete(db, question_id)
    if not q:
        raise HTTPException(status_code=404, detail="Reading question not found")
    return {"message": "Deleted successfully"}
