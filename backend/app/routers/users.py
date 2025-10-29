from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User
from app.schemas import User as UserSchema
from app.auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=List[UserSchema])
async def get_users(
    role: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    
    users = query.all()
    return users


@router.get("/students", response_model=List[UserSchema])
async def get_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    students = db.query(User).filter(User.role == "student").all()
    return students


@router.get("/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    return user