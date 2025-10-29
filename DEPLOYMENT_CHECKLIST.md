# ✅ Deployment Checklist - Academic Gradebook

## Предварительная проверка

- [ ] Docker и Docker Compose установлены
- [ ] Git установлен
- [ ] Порты 3000 и 8000 свободны

## Шаг 1: Создание структуры проекта

```bash
mkdir academic-gradebook && cd academic-gradebook
```

### Корневая директория
- [ ] `docker-compose.yml` - файл оркестрации Docker
- [ ] `README.md` - главная документация
- [ ] `QUICKSTART.md` - руководство быстрого старта

### Backend директория (/backend)
- [ ] `Dockerfile`
- [ ] `requirements.txt`
- [ ] `README.md`

#### Backend/app
- [ ] `__init__.py`
- [ ] `main.py`
- [ ] `database.py`
- [ ] `models.py`
- [ ] `schemas.py`
- [ ] `auth.py`

#### Backend/app/routers
- [ ] `__init__.py`
- [ ] `auth.py`
- [ ] `users.py`
- [ ] `assignments.py`
- [ ] `grades.py`
- [ ] `reports.py`

#### Backend/app/utils
- [ ] `__init__.py`
- [ ] `security.py`

### Frontend директория (/frontend)
- [ ] `Dockerfile`
- [ ] `package.json`
- [ ] `README.md`

#### Frontend/public
- [ ] `index.html`

#### Frontend/src
- [ ] `index.jsx`
- [ ] `App.jsx`

#### Frontend/src/services
- [ ] `api.js`

#### Frontend/src/context
- [ ] `AuthContext.jsx`

#### Frontend/src/components/common
- [ ] `Header.jsx`
- [ ] `Loader.jsx`

#### Frontend/src/components/teacher
- [ ] `Dashboard.jsx`
- [ ] `AssignmentForm.jsx`
- [ ] `GradeTable.jsx`
- [ ] `ReportGenerator.jsx`

#### Frontend/src/components/student
- [ ] `StudentDashboard.jsx`

#### Frontend/src/pages
- [ ] `Login.jsx`
- [ ] `TeacherPanel.jsx`
- [ ] `StudentPanel.jsx`

## Шаг 2: Запуск приложения

```bash
docker-compose up --build
```

- [ ] Backend контейнер запущен (gradebook-backend)
- [ ] Frontend контейнер запущен (gradebook-frontend)
- [ ] Нет ошибок в логах

## Шаг 3: Проверка работоспособности

### Backend
- [ ] http://localhost:8000 - корневой endpoint отвечает
- [ ] http://localhost:8000/docs - Swagger документация загружается
- [ ] http://localhost:8000/health - healthcheck проходит

### Frontend
- [ ] http://localhost:3000 - приложение загружается
- [ ] Страница входа отображается корректно
- [ ] Кнопки тестовых аккаунтов работают

### Тестовая авторизация
- [ ] Вход как преподаватель (teacher@example.com / teacher123) работает
- [ ] Вход как студент (student1@example.com / student123) работает
- [ ] После входа перенаправление на правильную панель

### Функциональность преподавателя
- [ ] Панель управления отображает статистику
- [ ] Можно создать новое задание
- [ ] Можно добавить оценку студенту
- [ ] Можно сгенерировать отчёт
- [ ] Экспорт в CSV работает

### Функциональность студента
- [ ] Отображаются оценки
- [ ] Отображается список заданий
- [ ] Статистика корректна

## Шаг 4: Проверка базы данных

- [ ] Файл `backend/data/gradebook.db` создан
- [ ] Тестовые данные загружены
- [ ] Таблицы созданы (users, assignments, grades)

## Шаг 5: Дополнительные проверки

### Безопасность
- [ ] JWT токены работают
- [ ] Защищенные роуты недоступны без токена
- [ ] Роли (teacher/student) проверяются корректно
- [ ] Пароли хешируются

### API
- [ ] Все CRUD операции для заданий работают
- [ ] Все CRUD операции для оценок работают
- [ ] Фильтрация оценок работает
- [ ] Генерация отчётов работает

### UI/UX
- [ ] Навигация между разделами работает
- [ ] Формы валидируются
- [ ] Загрузочные индикаторы отображаются
- [ ] Сообщения об ошибках показываются
- [ ] Успешные операции подтверждаются

## Шаг 6: Тестирование

### Backend тесты
```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest
```
- [ ] Все тесты проходят

### Frontend тесты
```bash
cd frontend
npm test
```
- [ ] Все тесты проходят

## Шаг 7: Production готовность

- [ ] SECRET_KEY изменен на уникальный
- [ ] CORS настроен для продакшен домена
- [ ] База данных заменена на PostgreSQL (опционально)
- [ ] HTTPS настроен
- [ ] Логирование настроено
- [ ] Backup стратегия определена

## Troubleshooting

### Если что-то не работает:

1. **Проверить логи:**
```bash
docker-compose logs backend
docker-compose logs frontend
```

2. **Перезапустить контейнеры:**
```bash
docker-compose down
docker-compose up --build
```

3. **Очистить всё и начать заново:**
```bash
docker-compose down -v
docker-compose up --build
```

4. **Проверить порты:**
```bash
# Linux/Mac
lsof -i :3000
lsof -i :8000

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

## Финальная проверка

- [ ] Все файлы созданы
- [ ] Docker контейнеры запущены
- [ ] Приложение доступно
- [ ] Авторизация работает
- [ ] Все функции доступны
- [ ] Нет критических ошибок в консоли
- [ ] База данных работает корректно

## 🎉 Готово!

Если все пункты отмечены ✅, проект успешно развернут и готов к использованию!

---

**Дата проверки:** _____________  
**Проверил:** _____________  
**Версия:** 1.0.0