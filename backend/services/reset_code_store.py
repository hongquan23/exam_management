import secrets
import time
from typing import Dict, Tuple

# {email: (code, expiry_timestamp)}
_store: Dict[str, Tuple[str, float]] = {}

_CODE_TTL_SECONDS = 600  # 10 phút


def generate(email: str) -> str:
    code = str(secrets.randbelow(1_000_000)).zfill(6)
    _store[email] = (code, time.time() + _CODE_TTL_SECONDS)
    return code


def verify(email: str, code: str) -> bool:
    entry = _store.get(email)
    if not entry:
        return False
    stored_code, expiry = entry
    if time.time() > expiry:
        _store.pop(email, None)
        return False
    return stored_code == code


def consume(email: str, code: str) -> bool:
    """Xác minh và xóa code sau khi dùng một lần."""
    if verify(email, code):
        _store.pop(email, None)
        return True
    return False
