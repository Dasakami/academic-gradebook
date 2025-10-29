from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_PATH = "./data/gradebook.db"

os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DATABASE_PATH}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app.models import User, Assignment, Grade
    from app.utils.security import get_password_hash
    from datetime import datetime, timedelta
    
    db = SessionLocal()
    
    try:
        if db.query(User).first() is not None:
            return
        teacher = User(
            email="teacher@example.com",
            password_hash=get_password_hash("teacher123"),
            full_name="Иванов Иван Иванович",
            role="teacher"
        )
        
        student1 = User(
            email="student1@example.com",
            password_hash=get_password_hash("student123"),
            full_name="Петров Петр Петрович",
            role="student"
        )
        
        student2 = User(
            email="student2@example.com",
            password_hash=get_password_hash("student123"),
            full_name="Сидорова Мария Владимировна",
            role="student"
        )
        
        db.add_all([teacher, student1, student2])
        db.commit()
        assignment1 = Assignment(
            title="Лабораторная работа №1",
            description="Основы программирования на Python",
            max_score=100,
            deadline=datetime.now() + timedelta(days=7),
            created_by=teacher.id
        )
        
        assignment2 = Assignment(
            title="Контрольная работа",
            description="Структуры данных и алгоритмы",
            max_score=100,
            deadline=datetime.now() + timedelta(days=14),
            created_by=teacher.id
        )
        
        db.add_all([assignment1, assignment2])
        db.commit()
        
        grade1 = Grade(
            assignment_id=assignment1.id,
            student_id=student1.id,
            score=85,
            submitted_at=datetime.now() - timedelta(days=1),
            graded_at=datetime.now()
        )
        
        grade2 = Grade(
            assignment_id=assignment1.id,
            student_id=student2.id,
            score=92,
            submitted_at=datetime.now() - timedelta(days=2),
            graded_at=datetime.now()
        )
        
        db.add_all([grade1, grade2])
        db.commit()
        
        print("✅ База данных инициализирована с тестовыми данными")
        
    except Exception as e:
        print(f"❌ Ошибка при инициализации БД: {e}")
        db.rollback()
    finally:
        db.close()