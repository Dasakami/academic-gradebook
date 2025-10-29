from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Assignment, User
from app.schemas import AssignmentCreate, Assignment as AssignmentSchema, AssignmentUpdate, AssignmentWithTeacher
from app.auth import get_current_user, get_current_teacher

router = APIRouter()


@router.get("/", response_model=List[AssignmentWithTeacher])
async def get_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignments = db.query(Assignment).all()
    return assignments


@router.get("/{assignment_id}", response_model=AssignmentWithTeacher)
async def get_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задание не найдено"
        )
    return assignment


@router.post("/", response_model=AssignmentSchema, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    assignment_data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_teacher: User = Depends(get_current_teacher)
):
    new_assignment = Assignment(
        **assignment_data.dict(),
        created_by=current_teacher.id
    )
    
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    
    return new_assignment


@router.put("/{assignment_id}", response_model=AssignmentSchema)
async def update_assignment(
    assignment_id: int,
    assignment_data: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_teacher: User = Depends(get_current_teacher)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задание не найдено"
        )
    
    if assignment.created_by != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы можете редактировать только свои задания"
        )
    
    for field, value in assignment_data.dict(exclude_unset=True).items():
        setattr(assignment, field, value)
    
    db.commit()
    db.refresh(assignment)
    
    return assignment


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_teacher: User = Depends(get_current_teacher)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задание не найдено"
        )
    
    if assignment.created_by != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы можете удалять только свои задания"
        )
    
    db.delete(assignment)
    db.commit()
    
    return None