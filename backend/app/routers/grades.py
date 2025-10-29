from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import Grade, User, Assignment
from app.schemas import GradeCreate, Grade as GradeSchema, GradeUpdate, GradeWithDetails
from app.auth import get_current_user, get_current_teacher

router = APIRouter()


@router.get("/", response_model=List[GradeWithDetails])
async def get_grades(
    assignment_id: int = None,
    student_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Grade)

    if current_user.role == "student":
        query = query.filter(Grade.student_id == current_user.id)
    elif student_id:
        query = query.filter(Grade.student_id == student_id)
    
    if assignment_id:
        query = query.filter(Grade.assignment_id == assignment_id)
    
    grades = query.all()
    return grades


@router.get("/{grade_id}", response_model=GradeWithDetails)
async def get_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Оценка не найдена"
        )
    if current_user.role == "student" and grade.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен"
        )
    
    return grade


@router.post("/", response_model=GradeSchema, status_code=status.HTTP_201_CREATED)
async def create_grade(
    grade_data: GradeCreate,
    db: Session = Depends(get_db),
    current_teacher: User = Depends(get_current_teacher)
):
    assignment = db.query(Assignment).filter(Assignment.id == grade_data.assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задание не найдено"
        )
    student = db.query(User).filter(
        User.id == grade_data.student_id,
        User.role == "student"
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Студент не найден"
        )
    existing_grade = db.query(Grade).filter(
        Grade.assignment_id == grade_data.assignment_id,
        Grade.student_id == grade_data.student_id
    ).first()
    
    if existing_grade:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Оценка для этого студента по данному заданию уже существует"
        )
    
    if grade_data.score < 0 or grade_data.score > assignment.max_score:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Оценка должна быть от 0 до {assignment.max_score}"
        )
    
    new_grade = Grade(
        **grade_data.dict(),
        graded_at=datetime.now()
    )
    
    db.add(new_grade)
    db.commit()
    db.refresh(new_grade)
    
    return new_grade


@router.put("/{grade_id}", response_model=GradeSchema)
async def update_grade(
    grade_id: int,
    grade_data: GradeUpdate,
    db: Session = Depends(get_db),
    current_teacher: User = Depends(get_current_teacher)
):
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Оценка не найдена"
        )

    if grade_data.score is not None:
        assignment = db.query(Assignment).filter(Assignment.id == grade.assignment_id).first()
        if grade_data.score < 0 or grade_data.score > assignment.max_score:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Оценка должна быть от 0 до {assignment.max_score}"
            )
    
    for field, value in grade_data.dict(exclude_unset=True).items():
        setattr(grade, field, value)
    
    grade.graded_at = datetime.now()
    
    db.commit()
    db.refresh(grade)
    
    return grade


@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_teacher: User = Depends(get_current_teacher)
):
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Оценка не найдена"
        )
    
    db.delete(grade)
    db.commit()
    
    return None