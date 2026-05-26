from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from crud import user as user_crud
from schemas.user import UserCreate, UserLogin, ChangePassword
from core.security import (
    hash_password,
    verify_password,
    create_access_token
)
from services import email_service, reset_code_store



def update_name(db: Session, user_id: int, new_name: str):

    user = user_crud.update_name(db, user_id, new_name)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {"message": "Name updated successfully"}

def register_user(db: Session, user_in: UserCreate):
    if user_crud.get_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )

    password_hash = hash_password(user_in.password)
    return user_crud.create(db, user_in, password_hash)


def login_user(db: Session, user_in: UserLogin):
    user = user_crud.get_by_email(db, user_in.email)
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }


def change_password(db: Session, user_id: int, data: ChangePassword):

    user = user_crud.get_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # kiểm tra mật khẩu cũ
    if not verify_password(data.current_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password incorrect"
        )

    # hash mật khẩu mới
    new_hash = hash_password(data.new_password)

    user_crud.update_password(db, user_id, new_hash)

    return {"message": "Password updated successfully"}


def forgot_password(db: Session, email: str):
    email = email.lower().strip()
    user = user_crud.get_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email không tồn tại trong hệ thống"
        )
    code = reset_code_store.generate(email)
    try:
        email_service.send_reset_code_email(email, code)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể gửi email xác nhận: {exc}"
        )
    return {"message": "Mã xác nhận đã được gửi đến email của bạn"}


def verify_forgot_code(email: str, code: str):
    if not reset_code_store.verify(email.lower().strip(), code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã xác nhận không đúng hoặc đã hết hạn"
        )
    return {"message": "Mã xác nhận hợp lệ"}


def reset_password_with_code(db: Session, email: str, code: str, new_password: str):
    email = email.lower().strip()
    if not reset_code_store.consume(email, code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã xác nhận không đúng hoặc đã hết hạn"
        )
    user = user_crud.get_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    new_hash = hash_password(new_password)
    user_crud.update_password(db, user.id, new_hash)
    return {"message": "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại."}
