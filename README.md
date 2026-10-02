# ДЗ 3.3. API Yandex ID

## Запуск

1. Зарегистрируйте приложение на https://oauth.yandex.ru/client/new: платформа «Веб-сервисы», Callback URI `http://localhost:3000/auth/yandex/callback`, права `login:info` и `login:email`.
2. Установите зависимости: `npm install`.
3. Создайте `.env` по образцу `.env.example` (ID и пароль приложения, `SESSION_SECRET`).
4. Запустите: `node index.js` и откройте http://localhost:3000.
