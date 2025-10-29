from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models import User, Assignment, Grade
from app.schemas import StudentReport, CourseReport
from app.auth import get_current_teacher

router = APIRouter()


@router.get("/student/{student_id}", response_model=StudentReport)
async def get_student_report(
    student_id: int,
    db: Session = Depends(get_db),
    current_teacher: User = Depends(get_current_teacher)
):
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Студент не найден"
        )
    
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    
    total_assignments = db.query(Assignment).count()
    completed_assignments = len(grades)
    average_score = db.query(func.avg(Grade.score)).filter(
        Grade.student_id == student_id
    ).scalar() or 0
    
    return {
        "student": student,
        "total_assignments": total_assignments,
        "completed_assignments": completed_assignments,
        "average_score": round(average_score, 2),
        "grades": grades
    }


@router.get("/course", response_model=CourseReport)
async def get_course_report(
    db: Session = Depends(get_db),
    current_teacher: User = Depends(get_current_teacher)
):
    students = db.query(User).filter(User.role == "student").all()
    total_assignments = db.query(Assignment).count()
    
    student_reports = []
    total_scores = []
    
    for student in students:
        grades = db.query(Grade).filter(Grade.student_id == student.id).all()
        
        if grades:
            avg_score = sum(g.score for g in grades) / len(grades)
            total_scores.append(avg_score)
        else:
            avg_score = 0
        
        student_reports.append({
            "student": student,
            "total_assignments": total_assignments,
            "completed_assignments": len(grades),
            "average_score": round(avg_score, 2),
            "grades": grades
        })
    
    overall_average = sum(total_scores) / len(total_scores) if total_scores else 0
    
    return {
        "total_students": len(students),
        "total_assignments": total_assignments,
        "average_score": round(overall_average, 2),
        "student_reports": student_reports
    }