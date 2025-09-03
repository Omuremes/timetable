# Настройка Firebase для проекта расписаний

## Шаги для настройки Firebase:

1. **Создайте проект Firebase:**
   - Перейдите на https://console.firebase.google.com/
   - Нажмите "Создать проект"
   - Введите название проекта (например, "timetable-app")
   - Следуйте инструкциям для создания проекта

2. **Настройте Firestore Database:**
   - В консоли Firebase перейдите в раздел "Firestore Database"
   - Нажмите "Создать базу данных"
   - Выберите режим "Начать в тестовом режиме" (для разработки)
   - Выберите регион (например, eur3 для Европы)

3. **Получите конфигурацию веб-приложения:**
   - В настройках проекта перейдите на вкладку "Общие"
   - В разделе "Ваши приложения" нажмите "Веб"
   - Введите название приложения
   - Скопируйте объект firebaseConfig

4. **Настройте переменные окружения:**
   - Скопируйте файл `.env.example` в `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Откройте файл `.env.local` и замените значения на ваши реальные данные из Firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=ваш-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ваш-проект.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ваш-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ваш-проект.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ваш-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=ваш-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=ваш-measurement-id
```

**ВАЖНО:** Никогда не коммитьте файл `.env.local` в git! Он уже добавлен в `.gitignore`.

5. **Настройте правила безопасности Firestore (для разработки):**
   - В консоли Firebase перейдите в Firestore Database -> Правила
   - Замените правила на следующие (ТОЛЬКО ДЛЯ РАЗРАБОТКИ):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**ВАЖНО:** Эти правила разрешают всем читать и писать в вашу базу данных. 
Для продакшена обязательно настройте более строгие правила безопасности.

## Структура данных в Firestore:

Коллекция: `timetables`
Документы содержат:
- `name` (string) - название расписания
- `schedule` (object) - данные расписания по дням недели
- `createdAt` (timestamp) - время создания
- `updatedAt` (timestamp) - время последнего обновления

## Возможности после настройки:

- ✅ Автоматическая синхронизация данных между устройствами
- ✅ Сохранение данных в облаке
- ✅ Обновления в реальном времени
- ✅ Резервное копирование данных
- ✅ Совместная работа (если добавить аутентификацию)

## Для продакшена:

1. Добавьте Firebase Authentication
2. Настройте строгие правила безопасности
3. Настройте индексы для оптимизации запросов
4. Добавьте обработку ошибок и retry логику
