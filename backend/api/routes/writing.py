
import json
from services.speaking_AI.toeic_scorer import score_toeic_w_q1_5, score_toeic_w_q6_7, score_toeic_w_q8
from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.writing import WritingQuestionCreate, WritingQuestionOut
from crud import writing as writing_crud

router = APIRouter()

@router.post("/", response_model=WritingQuestionOut)
def create_question(q: WritingQuestionCreate, db: Session = Depends(get_db)):
    return writing_crud.create(db, q)

@router.get("/section/{section_id}", response_model=list[WritingQuestionOut])
def get_questions(section_id: int, db: Session = Depends(get_db)):
    return writing_crud.get_by_section(db, section_id)

@router.post("/q1_5")
def writing_part1(
    image_description: str = Form(...),
    required_word_1: str = Form(...),
    required_word_2: str = Form(...),
    student_sentence: str = Form(...)
):
    required_words_list = [required_word_1, required_word_2]

    evaluation = score_toeic_w_q1_5(
        image_description,
        required_words_list,
        student_sentence
    )

   

    return {
        "feedback": evaluation
    }


@router.post("/q6_7")
def writing_q6_7(
    email_prompt: str = Form(...),
    directions: str = Form(...),
    student_response: str = Form(...)
):
    evaluation = score_toeic_w_q6_7(
        email_prompt,
        student_response,
        directions
    )

    return {
        "feedback": evaluation
    }


@router.post("/q8")
def writing_q8(
    question: str = Form(...),
    student_response: str = Form(...)
):
    evaluation = score_toeic_w_q8(
        question,
        student_response
    )

    return {
        "feedback": evaluation
    }