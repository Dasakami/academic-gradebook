from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    max_score: float = Field(gt=0)
    deadline: Optional[datetime] = None


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    max_score: Optional[float] = None
    deadline: Optional[datetime] = None


class Assignment(AssignmentBase):
    id: int
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class AssignmentWithTeacher(Assignment):
    teacher: User


class GradeBase(BaseModel):
    assignment_id: int
    student_id: int
    score: float
    comment: Optional[str] = None


class GradeCreate(GradeBase):
    pass


class GradeUpdate(BaseModel):
    score: Optional[float] = None
    comment: Optional[str] = None


class Grade(GradeBase):
    id: int
    submitted_at: datetime
    graded_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class GradeWithDetails(Grade):
    assignment: Assignment
    student: User


class StudentReport(BaseModel):
    student: User
    total_assignments: int
    completed_assignments: int
    average_score: float
    grades: List[GradeWithDetails]


class CourseReport(BaseModel):
    total_students: int
    total_assignments: int
    average_score: float
    student_reports: List[StudentReport]