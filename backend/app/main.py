from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, init_db
from app.routers import auth, users, assignments, grades, reports

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Academic Gradebook API",
    description="API для системы цифрового зачётного ведомости",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(assignments.router, prefix="/api/assignments", tags=["Assignments"])
app.include_router(grades.router, prefix="/api/grades", tags=["Grades"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/")
async def root():
    return {
        "message": "Academic Gradebook API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}