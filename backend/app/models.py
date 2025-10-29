from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    TEACHER = "teacher"
    STUDENT = "student"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  
    created_at = Column(DateTime, default=datetime.now)
    
    created_assignments = relationship("Assignment", back_populates="teacher", foreign_keys="Assignment.created_by")
    grades = relationship("Grade", back_populates="student")


class Assignment(Base):
    __tablename__ = "assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    max_score = Column(Float, nullable=False)
    deadline = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.now)
    
    teacher = relationship("User", back_populates="created_assignments", foreign_keys=[created_by])
    grades = relationship("Grade", back_populates="assignment", cascade="all, delete-orphan")


class Grade(Base):
    __tablename__ = "grades"
    
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=False)
    comment = Column(Text)
    submitted_at = Column(DateTime, default=datetime.now)
    graded_at = Column(DateTime)
    
    assignment = relationship("Assignment", back_populates="grades")
    student = relationship("User", back_populates="grades")