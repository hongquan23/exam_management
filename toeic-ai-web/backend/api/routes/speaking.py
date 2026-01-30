
import os
import tempfile

import uuid

from fastapi import APIRouter, Depends,Form, File, UploadFile
from sqlalchemy.orm import Session
from services.speaking_AI.whisper_service import transcribe_audio
from services.speaking_AI.toeic_scorer import score_toeic_sp_q11, score_toeic_sp_q1_2,score_toeic_sp_q3_4,score_toeic_sp_q5_7, score_toeic_sp_q8_10
from fastapi import HTTPException
import subprocess



from api.deps import get_db
from schemas.speaking import SpeakingQuestionCreate, SpeakingQuestionOut
from crud import speaking as speaking_crud

router = APIRouter()

UPLOAD_DIR = "images/speaking/"

@router.post("/")
def create_speaking_question(
    section_id: int = Form(...),
    direction: str = Form(...),
    question: str = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    image_path = None

    if image:
        ext = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as f:
            f.write(image.file.read())

        image_path = file_path  # 👈 đường dẫn lưu DB

    data = {
        "section_id": section_id,
        "question": question,
        "image_url": image_path,
        "direction": direction
    }

    return speaking_crud.create(db, data)

@router.get("/section/{section_id}", response_model=list[SpeakingQuestionOut])
def get_questions(section_id: int, db: Session = Depends(get_db)):
    return speaking_crud.get_by_section(db, section_id)


@router.post("/q1-2")
async def speaking_part_1_2(
    reference_text: str = Form(...),
    audio: UploadFile = File(...)
):
    temp_dir = tempfile.gettempdir()

    raw_path = os.path.join(temp_dir, f"{uuid.uuid4()}.webm")
    wav_path = raw_path.replace(".webm", ".wav")

    # Save audio
    with open(raw_path, "wb") as f:
        f.write(await audio.read())

    # Convert to WAV (16kHz mono)
    subprocess.run([
        "ffmpeg", "-y",
        "-i", raw_path,
        "-ar", "16000",
        "-ac", "1",
        wav_path
    ], check=True)

    # Whisper STT
    transcript = transcribe_audio(wav_path)

    # TOEIC scoring
    feedback = score_toeic_sp_q1_2(reference_text, transcript)

    return {
        "transcript": transcript,
        "feedback": feedback
    }



@router.post("/q3-4")
async def speaking_q3_4(
    audio: UploadFile = File(...),
    reference_text: str = Form(...),
):
    temp_dir = tempfile.gettempdir()

    raw_path = os.path.join(temp_dir, f"{uuid.uuid4()}.webm")
    wav_path = raw_path.replace(".webm", ".wav")

    with open(raw_path, "wb") as f:
        f.write(await audio.read())

    try:
        subprocess.run([
            "ffmpeg", "-y",
            "-i", raw_path,
            "-ar", "16000",
            "-ac", "1",
            wav_path
        ], check=True)
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=400, detail="Invalid audio file")

    transcript = transcribe_audio(wav_path)
    feedback = score_toeic_sp_q3_4(transcript, reference_text)

    try:
        os.remove(raw_path)
        os.remove(wav_path)
    except Exception:
        pass

    return {
        "transcript": transcript,
        "evaluation": feedback
    }


@router.post("/q5-7")
async def speaking_q5_7(
    audio: UploadFile = File(...),
    question: str = Form(...),
):
    temp_dir = tempfile.gettempdir()

    raw_path = os.path.join(temp_dir, f"{uuid.uuid4()}.webm")
    wav_path = raw_path.replace(".webm", ".wav")

    with open(raw_path, "wb") as f:
        f.write(await audio.read())

    try:
        subprocess.run([
            "ffmpeg", "-y",
            "-i", raw_path,
            "-ar", "16000",
            "-ac", "1",
            wav_path
        ], check=True)
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=400, detail="Invalid audio file")

    transcript = transcribe_audio(wav_path)
    feedback = score_toeic_sp_q5_7(question, transcript)

    try:
        os.remove(raw_path)
        os.remove(wav_path)
    except Exception:
        pass

    return {
        "transcript": transcript,
        "evaluation": feedback
    }


@router.post("/q8-10")
async def speaking_q8_10(
    poster_text: str = Form(...),
    q8: str = Form(...),
    q9: str = Form(...),
    q10: str = Form(...),
    audio: UploadFile = File(...)
):
    temp_dir = tempfile.gettempdir()
    audio_path = os.path.join(temp_dir, f"{uuid.uuid4()}.wav")

    with open(audio_path, "wb") as f:
        f.write(await audio.read())

    transcript = transcribe_audio(audio_path)


    evaluation = score_toeic_sp_q8_10(
        poster_text=poster_text,
        questions=[q8, q9, q10],
        transcript=transcript)

    return {
        "transcript": transcript,
        "evaluation": evaluation
    }


@router.post("/q11")
async def speaking_q11(
    question: str = Form(...),
    audio: UploadFile = File(...)
):
    temp_dir = tempfile.gettempdir()
    audio_path = os.path.join(temp_dir, f"{uuid.uuid4()}.wav")

    with open(audio_path, "wb") as f:
        f.write(await audio.read())

    transcript = transcribe_audio(audio_path)

   

    evaluation = score_toeic_sp_q11(question, transcript)

    return {
        "transcript": transcript,
        "evaluation": evaluation
    }


    evaluation = score_toeic_sp_q11(question, transcript)

    return {
        "transcript": transcript,
        "evaluation": evaluation
    }
