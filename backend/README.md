# Academic Gradebook - Backend

Серверная часть системы цифрового зачётного ведомости на FastAPI.

## 🚀 Технологии

- **Python 3.11**
- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **SQLite** - база данных
- **JWT** - аутентификация
- **Pydantic** - валидация данных

## 📁 Структура проекта

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Главный файл приложения
│   ├── database.py          # Конфигурация БД
│   ├── models.py            # SQLAlchemy модели
│   ├── schemas.py           # Pydantic схемы
│   ├── auth.py              # Аутентификация
│   ├── routers/
│   │   ├── auth.py          # Роуты авторизации
│   │   ├── users.py         # Роуты пользователей
│   │   ├── assignments.py   # Роуты заданий
│   │   ├── grades.py        # Роуты оценок
│   │   └── reports.py       # Роуты отчетов
│   └── utils/
│       └── security.py      # Утилиты безопасности
├── data/                    # Директория для БД
├── requirements.txt
├── Dockerfile
└── README.md
```

## 🗄 Структура базы данных

### Таблица Users (Пользователи)
- `id` - уникальный идентификатор
- `email` - электронная почта (уникальная)
- `password_hash` - хеш пароля
- `full_name` - полное имя
- `role` - роль (teacher/student)
- `created_at` - дата создания

### Таблица Assignments (Задания)
- `id` - уникальный идентификатор
- `title` - название задания
- `description` - описание
- `max_score` - максимальный балл
- `deadline` - срок сдачи
- `created_by` - ID преподавателя
- `created_at` - дата создания

### Таблица Grades (Оценки)
- `id` - уникальный идентификатор
- `assignment_id` - ID задания
- `student_id` - ID студента
- `score` - полученная оценка
- `comment` - комментарий
- `submitted_at` - дата сдачи
- `graded_at` - дата оценивания

## 🔧 Установка и запуск

### Локальный запуск

```bash
# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# Установить зависимости
pip install -r requirements.txt

# Запустить сервер
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Запуск в Docker

```bash
# Собрать образ
docker build -t gradebook-backend .

# Запустить контейнер
docker run -p 8000:8000 -v $(pwd)/data:/app/data gradebook-backend
```

## 📚 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Авторизация

### Пользователи
- `GET /api/users/me` - Получить текущего пользователя
- `GET /api/users/` - Список всех пользователей
- `GET /api/users/students` - Список студентов
- `GET /api/users/{user_id}` - Получить пользователя по ID

### Задания
- `GET /api/assignments/` - Список всех заданий
- `GET /api/assignments/{id}` - Получить задание по ID
- `POST /api/assignments/` - Создать задание (только преподаватель)
- `PUT /api/assignments/{id}` - Обновить задание (только преподаватель)
- `DELETE /api/assignments/{id}` - Удалить задание (только преподаватель)

### Оценки
- `GET /api/grades/` - Список оценок (с фильтрацией)
- `GET /api/grades/{id}` - Получить оценку по ID
- `POST /api/grades/` - Создать оценку (только преподаватель)
- `PUT /api/grades/{id}` - Обновить оценку (только преподаватель)
- `DELETE /api/grades/{id}` - Удалить оценку (только преподаватель)

### Отчеты
- `GET /api/reports/student/{id}` - Отчет по студенту
- `GET /api/reports/course` - Общий отчет по курсу

## 🔐 Аутентификация

API использует JWT токены для аутентификации. После успешной авторизации клиент получает токен, который должен передаваться в заголовке:

```
Authorization: Bearer <token>
```

## 🧪 Тестовые данные

При первом запуске автоматически создаются тестовые пользователи:

**Преподаватель:**
- Email: teacher@example.com
- Password: teacher123

**Студенты:**
- Email: student1@example.com / Password: student123
- Email: student2@example.com / Password: student123

## 📖 Документация API

После запуска сервера доступна интерактивная документация:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔒 Безопасность

- Пароли хешируются с помощью bcrypt
- JWT токены с ограниченным сроком действия (24 часа)
- Ролевая система доступа (teacher/student)
- Валидация всех входных данных

## 🐛 Отладка

```bash
# Логи выводятся в консоль
# Для детальной отладки используйте --log-level debug
uvicorn app.main:app --reload --log-level debug
```

## 📝 Переменные окружения

- `DATABASE_URL` - URL базы данных (по умолчанию: sqlite:///./data/gradebook.db)
- `SECRET_KEY` - секретный ключ для JWT (обязательно изменить в продакшене)
- `CORS_ORIGINS` - разрешенные CORS origins

## 🤝 Разработка

```bash
# Установка dev зависимостей
pip install pytest pytest-asyncio httpx

# Запуск тестов
pytest

# Форматирование кода
black app/

# Линтинг
flake8 app/
```

## 📄 Лицензия

MIT License