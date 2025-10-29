
---

# Academic Gradebook

Система цифрового зачётного ведомости для преподавателей и студентов.

## 🚀 Технологии

* **Frontend:** React 18, React Router v6, Axios, Context API, CSS-in-JS
* **Backend:** Python 3.11, FastAPI, SQLAlchemy, SQLite, JWT, Pydantic

## 📁 Структура проекта

```
frontend/      # Клиентская часть
├── src/
│   ├── components/     # UI компоненты (Header, Loader, Dashboard, GradeTable)
│   ├── pages/          # Страницы (Login, TeacherPanel, StudentPanel)
│   └── services/       # API клиент
backend/       # Серверная часть
├── app/
│   ├── main.py         # Запуск сервера
│   ├── models.py       # Модели БД
│   ├── routers/        # API роуты
│   └── utils/          # Утилиты
├── data/               # SQLite база данных
```

## 🔐 Аутентификация

* JWT токены для безопасного входа
* Роли: **teacher** и **student**
* Токен сохраняется в `localStorage` и используется для API запросов

## 🎯 Функциональность

**Преподаватели:**

* Управление курсами и заданиями
* Добавление и редактирование оценок
* Генерация отчётов и экспорт в CSV

**Студенты:**

* Просмотр заданий и оценок
* Отслеживание прогресса и среднего балла

## 🔗 API

* `/api/auth/login` – авторизация
* `/api/users/me` – текущий пользователь
* `/api/assignments/` – задания
* `/api/grades/` – оценки
* `/api/reports/` – отчёты

## 🖥 Запуск

**Frontend:**

```bash
cd frontend
npm install
npm start
```

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📄 Лицензия

MIT License

---


