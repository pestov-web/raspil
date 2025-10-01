# 🧮 Raspil - Калькулятор расходов

<div align="center">

![Raspil Logo](https://img.shields.io/badge/💰-Raspil-4f46e5?style=for-the-badge&labelColor=white)

**Простой и удобный калькулятор для справедливого разделения общих расходов**

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.3-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)

![Feature-Sliced Design](https://img.shields.io/badge/Architecture-Feature--Sliced%20Design-success)
![PWA Configured](https://img.shields.io/badge/PWA-Configured-yellow)
![ESLint](https://img.shields.io/badge/ESLint-Configured-4b32c3?logo=eslint)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6e9f18?logo=vitest)

</div>

## 🌟 Возможности

-   👥 **Добавление участников** — легко добавляйте и удаляйте людей
-   💸 **Учет расходов** — вводите суммы, потраченные каждым участником
-   🧮 **Автоматический расчет** — справедливое разделение с учетом вкладов
-   💰 **Оптимальные переводы** — минимальное количество транзакций
-   � **Управление сессиями** — сохраняйте, загружайте и импортируйте расчеты
-   🔔 **Мгновенные уведомления** — кастомные тосты и диалоги вместо alert/prompt
-   🔗 **Шеринг по ссылке** — делитесь расчетом через `/share?data=...` маршрут
-   📱 **PWA настроен** — базовая конфигурация готова, можно развивать дальше
-   🎨 **Современный UI** — интерфейс на Tailwind CSS и Lucide Icons
-   ⚡ **Быстрая работа** — мгновенные расчеты без серверных запросов
-   🌗 **Тёмная тема** — переключатель с сохранением выбора пользователя
-   🧭 **Inline-валидация** — мгновенная подсветка некорректных сумм в таблице
-   ✨ **Анимации карточек** — плавный fade-in для таблиц и списков сессий

## 🚀 Быстрый старт

```bash
git clone https://github.com/pestov-web/raspil.git
cd raspil
pnpm install
pnpm dev
```

Откройте [http://localhost:5173](http://localhost:5173) в браузере.

## 🏗️ Архитектура

Проект построен на основе **Feature-Sliced Design (FSD)** — современной методологии архитектуры фронтенд приложений:

```
src/
├── app/                    # 🏗 Инициализация приложения
│   ├── App.tsx            # Корневой компонент, RouterProvider + ToastProvider
│   └── main.tsx           # Точка входа
├── pages/                 # 📄 Маршруты приложения
│   ├── home/              # Главный калькулятор и состояние
│   └── share-session/     # Импорт расчета по ссылке
├── widgets/               # 🧩 Композитные UI-блоки
│   ├── expense-calculator/
│   ├── expense-summary/
│   ├── people-manager/
│   ├── people-table/
│   ├── session-controls/
│   └── session-manager/
├── features/              # 🚀 Бизнес-функции
│   ├── add-person/
│   ├── calculate-duties/
│   ├── save-session/
│   ├── load-session/
│   └── toggle-theme/
├── entities/              # 🎯 Бизнес-сущности
│   ├── person/            # Модель человека
│   └── session/           # Сессии и метаданные
├── shared/                # ⚡ Переиспользуемые ресурсы
│   ├── lib/               # Расчеты, хранилище, sharing, validation, theme
│   ├── ui/                # UI-компоненты (StatCard, ToastProvider, ConfirmDialog)
│   ├── styles/            # Глобальные стили
│   └── assets/            # Статические ресурсы
└── tests/                 # 🧪 Юнит-тесты (Vitest)
```

## 🛠️ Технологический стек

### Frontend

-   **React 19.1.1** — современная версия React с последними возможностями
-   **TypeScript 5.6** — типизация для безопасности и удобства разработки
-   **Vite 7.1.3** — быстрая сборка и HMR для отличного DX
-   **Tailwind CSS 4.1.12** — utility-first CSS фреймворк
-   **React Router 7.9.3** — маршрутизация и шаринг по ссылкам

### Архитектура и инструменты

-   **Feature-Sliced Design** — масштабируемая архитектура
-   **Path Aliases** — удобные импорты (`~entities/person`, `~shared/ui`)
-   **ESLint** — статический анализ кода
-   **eslint-plugin-feature-sliced** — контроль направлений импортов по слоям
-   **Vitest** — быстрое unit-тестирование
-   **PWA (базовый)** — Service Worker и Web App Manifest

### UI и UX

-   **Lucide React** — красивые SVG иконки
-   **Responsive Design** — адаптивная верстка
-   **Gradient Backgrounds** — современный дизайн
-   **Color-coded States** — интуитивная индикация долгов/возвратов
-   **Headless UI + кастомные тосты** — анимированные модальные окна и уведомления через `ToastProvider`

## 📱 PWA статус

Raspil имеет **базовую PWA конфигурацию**:

-   ✅ **Service Worker** — автоматически генерируется Workbox
-   ✅ **Web App Manifest** — метаданные для установки приложения
-   ✅ **Офлайн кэширование** — статические файлы кэшируются автоматически
-   🔄 **В разработке** — улучшение иконок и дополнительных PWA фич

> **Примечание:** Для полноценного PWA опыта нужны кастомные иконки и дополнительная настройка

## 🧪 Тестирование

```bash
# Запустить тесты
pnpm test

# Покрытие кода
pnpm test:coverage
```

> Однократный прогон без watch: `pnpm test:run`

## 🔧 Доступные команды

```bash
# Разработка
pnpm dev              # Запуск dev-сервера
pnpm build            # Сборка для продакшена
pnpm preview          # Предпросмотр prod-сборки

# Качество кода
pnpm lint             # Проверка ESLint

# Тестирование
pnpm test             # Vitest в watch-режиме
pnpm test:run         # Однократный прогон
pnpm test:coverage    # Покрытие кода
```

## 🎯 Как использовать

1. **Добавьте участников** — нажмите "Добавить человека" и введите имена
2. **Укажите расходы** — введите сумму, которую потратил каждый человек; некорректные значения подсветятся сразу
3. **Рассчитайте** — нажмите "Рассчитать" для получения результатов
4. **Посмотрите переводы** — в сводке увидите, кто кому должен
5. **Поделитесь расчетом** — сохраните сессию и отправьте ссылку через кнопку «Поделиться»
6. **Выберите тему** — переключите светлую/тёмную тему; выбор запомнится автоматически

## 🔦 UX-акценты

-   **Тёмная/светлая тема** — активируется переключателем в правом верхнем углу и хранится в `localStorage`
-   **Fade-in анимации** — таблица участников и карточки сессий появляются плавно (Tailwind keyframe `fade-in-up`)
-   **Inline-валидация сумм** — неверные значения мгновенно подсвечиваются, а кнопка расчёта блокируется
-   **Дружелюбные уведомления** — тосты и подтверждения на базе Headless UI вместо модальных браузера

### Пример расчета:

-   **Общий ужин:** 3000₽
-   **Алиса потратила:** 2000₽
-   **Боб потратил:** 1000₽
-   **Чарли потратил:** 0₽

**Результат:** Чарли должен 500₽ Алисе

> Любой расчет можно отправить по ссылке вида `https://ваш-домен/share?data=...` — страница автоматически импортирует данные и сохранит сессию пользователю.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта!

1. Форкните репозиторий
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запуште ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Принципы разработки

-   Следуйте **Feature-Sliced Design** архитектуре
-   Используйте **TypeScript** для типобезопасности
-   Пишите **тесты** для новой функциональности
-   Соблюдайте **ESLint** правила

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

## 👨‍💻 Автор

**pestov-web** - [GitHub](https://github.com/pestov-web)

---

<div align="center">

**Raspil** — делаем разделение расходов простым и справедливым! 💰✨

[🌟 Поставить звезду](https://github.com/pestov-web/raspil) • [🐛 Сообщить об ошибке](https://github.com/pestov-web/raspil/issues) • [💡 Предложить идею](https://github.com/pestov-web/raspil/discussions)

</div>
