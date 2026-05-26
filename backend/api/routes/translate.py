import time
from collections import defaultdict
from fastapi import APIRouter, Request, HTTPException, status

from schemas.flashcard import TranslateRequest, TranslateResult
from services.translate_service import translate_text

router = APIRouter()

# Simple in-memory rate limiter: {user_id: [timestamps]}
_rate_store: dict[int, list[float]] = defaultdict(list)
_RATE_LIMIT = 15        # max requests
_RATE_WINDOW = 60.0     # per seconds


def _check_rate_limit(user_id: int) -> None:
    now = time.time()
    window_start = now - _RATE_WINDOW
    timestamps = [t for t in _rate_store[user_id] if t > window_start]
    if len(timestamps) >= _RATE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Vượt quá giới hạn {_RATE_LIMIT} lần dịch/phút. Vui lòng thử lại sau.",
        )
    timestamps.append(now)
    _rate_store[user_id] = timestamps


@router.post("/translate-selection", response_model=TranslateResult)
async def translate_selection(request: Request, body: TranslateRequest):
    user = request.state.user
    user_id: int = user.get("sub") or user.get("user_id") or 0

    _check_rate_limit(user_id)

    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text không được để trống.")
    if len(text) > 500:
        raise HTTPException(status_code=400, detail="Text không được vượt quá 500 ký tự.")

    try:
        result = translate_text(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi dịch thuật: {str(e)}")

    return TranslateResult(**result)
