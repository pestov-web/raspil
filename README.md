# 🧮 Raspil - Калькулятор расходов

> 🇷🇺 Этот README доступен на двух языках: [Русский](#-raspil---калькулятор-расходов) · [English](#-raspil---expense-calculator)

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
-   🗂️ **Управление сессиями** — сохраняйте, загружайте и импортируйте расчеты
-   🔔 **Мгновенные уведомления** — кастомные тосты и диалоги вместо alert/prompt
-   🔗 **Шеринг по ссылке** — делитесь расчётом через корневой `/?data=...` параметр
-   📱 **QR-шаринг** — показывайте QR-код для быстрого открытия расчёта
-   📤 **Экспорт в CSV и PDF** — выгружайте структурированные отчёты с переводами
-   📱 **PWA настроен** — базовая конфигурация готова, можно развивать дальше
-   🎨 **Современный UI** — интерфейс на Tailwind CSS и Lucide Icons
-   ⚡ **Быстрая работа** — мгновенные расчеты без серверных запросов
-   🌗 **Тёмная тема** — переключатель с сохранением выбора пользователя
-   🌍 **Двуязычный интерфейс** — мгновенное переключение RU ↔ EN с запоминанием языка
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
│   ├── remove-person/
│   ├── save-session/
│   ├── load-session/
│   ├── toggle-theme/
│   └── toggle-language/
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
-   **i18next + react-i18next** — локализация и управление языком интерфейса
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
-   **Language Toggle** — выпадающее меню с выбором RU/EN и подсказками доступности

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
6. **Смените язык при необходимости** — используйте иконку 🌐 в шапке, чтобы моментально переключаться между RU и EN; выбор сохранится
7. **Выберите тему** — переключите светлую/тёмную тему; выбор запомнится автоматически

## 🌍 Локализация

-   Поддерживаются 🇷🇺 **русский** и 🇬🇧 **английский** языки; переключение происходит мгновенно без перезагрузки
-   Переключатель языка (`LanguageToggle`) расположен рядом с переключателем темы и сохраняет выбор в `localStorage`
-   Все тексты интерфейса, экспорта (CSV/PDF) и шеринга генерируются через `i18next`; новые строки добавляйте в `~shared/lib/i18n.ts`
-   Если имя сессии или участника пустое, используется безопасный fallback (`Без названия`, `Person {{id}}`)
-   Тесты (`pnpm test`) автоматически инициализируют i18n, поэтому проверки текста должны опираться на `i18n.t(...)`

## 🔗 Экспорт и шаринг

-   **Шеринг по ссылке** — кнопка «Поделиться» генерирует короткий URL вида `/?data=...` и автоматически копирует его в буфер или открывает системное меню шаринга.
-   **QR-код** — отдельная кнопка формирует QR-код для быстрого обмена расчётом между устройствами.
-   **Экспорт в CSV** — выгрузка с UTF-8 BOM и структурированной таблицей (сводка, участники, переводы) открывается корректно в Excel/Numbers.
-   **Экспорт в PDF** — печатный отчёт с карточками, таблицами и подсветкой положительных/отрицательных балансов.
-   Все экспортируемые форматы включают список «кто кому переводит», что упрощает расчёты в офлайне.

## � UX-акценты

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

> Любой расчет можно отправить по ссылке вида `https://ваш-домен/?data=...` — страница автоматически импортирует данные и сохранит сессию пользователю.

## 🌗 Темизация для разработчиков

-   Tailwind работает в режиме `class`: глобальный файл `src/shared/styles/index.css` объявляет `@custom-variant dark (&:where(.dark, .dark *));`, поэтому все `dark:*` классы реагируют на класс `.dark` на корне документа.
-   Хелпер `theme.apply()` из `~shared/lib/theme.ts` синхронизирует класс `dark`, атрибут `data-theme` и `color-scheme` одновременно на `<html>` и `<body>` — не убирайте эти вызовы при рефакторинге.
-   Быстрый pre-paint bootstrap прописан в `index.html`, чтобы тёмная тема не мигала при загрузке.
-   Добавляя новые глобальные стили, убедитесь, что они используют Tailwind токены или `color-scheme` и не перекрывают `:where(.dark, .dark *)` селекторы.

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

Проект распространяется по коммерческой лицензии **Raspil Commercial License v1.0**. Полный текст приведён в файле [LICENSE](LICENSE). Для получения производственных или коммерческих прав обратитесь к автору проекта.

## 👨‍💻 Автор

**pestov-web** - [GitHub](https://github.com/pestov-web)

---

<div align="center">

**Raspil** — делаем разделение расходов простым и справедливым! 💰✨

[🌟 Поставить звезду](https://github.com/pestov-web/raspil) • [🐛 Сообщить об ошибке](https://github.com/pestov-web/raspil/issues) • [💡 Предложить идею](https://github.com/pestov-web/raspil/discussions)

</div>

---

# 🧮 Raspil - Expense Calculator

> 🇬🇧 This README is available in two languages: [English](#-raspil---expense-calculator) · [Русский](#-raspil---калькулятор-расходов)

<div align="center">

![Raspil Logo](https://img.shields.io/badge/💰-Raspil-4f46e5?style=for-the-badge&labelColor=white)

**A fast, friendly tool for splitting shared expenses fairly**

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.3-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)

![Feature-Sliced Design](https://img.shields.io/badge/Architecture-Feature--Sliced%20Design-success)
![PWA Configured](https://img.shields.io/badge/PWA-Configured-yellow)
![ESLint](https://img.shields.io/badge/ESLint-Configured-4b32c3?logo=eslint)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6e9f18?logo=vitest)

</div>

## 🌟 Features

-   👥 **Participant management** — add or remove people in a couple of clicks
-   💸 **Expense tracking** — enter how much each person spent with instant validation
-   🧮 **Automatic settlements** — calculate who should pay or receive money in one tap
-   💰 **Optimised transfers** — minimise the number of payments required
-   🗂️ **Session storage** — save, restore, import and export named scenarios
-   🔔 **Inline feedback** — custom toasts and dialogs instead of blocking alerts
-   🔗 **Shareable links** — generate URLs with encoded payloads via the `/?data=...` parameter
-   📱 **QR sharing** — show a QR code for quickly opening the calculation on another device
-   📤 **CSV & PDF export** — produce structured reports with balances and transfers
-   📱 **PWA-ready** — baseline configuration to install the app on devices
-   🎨 **Modern UI** — Tailwind CSS styling with Lucide icons and smooth gradients
-   ⚡ **Instant processing** — all calculations happen locally with zero backend calls
-   🌗 **Dark / light theme** — remember the preferred theme automatically
-   🌍 **Bilingual interface** — switch between RU ↔ EN instantly and persist the choice
-   🧭 **Inline validation** — highlight invalid numbers before running the calculation
-   ✨ **Animated cards** — smooth fade-in transitions for tables and saved sessions

## 🚀 Quick start

```bash
git clone https://github.com/pestov-web/raspil.git
cd raspil
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Architecture

The project follows **Feature-Sliced Design (FSD)** for scalable front-end architecture:

```
src/
├── app/                    # 🏗 Application bootstrap
│   ├── App.tsx            # Root component + providers (Router, i18n, Toasts)
│   └── main.tsx           # Entry point
├── pages/                 # 📄 Route-level pages
│   ├── home/              # Main calculator, state management
│   └── share-session/     # Import calculations from a shared link
├── widgets/               # 🧩 Composite UI blocks
│   ├── expense-calculator/
│   ├── expense-summary/
│   ├── people-manager/
│   ├── people-table/
│   ├── session-controls/
│   └── session-manager/
├── features/              # 🚀 User scenarios / actions
│   ├── add-person/
│   ├── calculate-duties/
│   ├── remove-person/
│   ├── save-session/
│   ├── load-session/
│   ├── toggle-theme/
│   └── toggle-language/
├── entities/              # 🎯 Domain models
│   ├── person/            # Person model and helpers
│   └── session/           # Session snapshots and metadata
├── shared/                # ⚡ Reusable resources
│   ├── lib/               # Calculations, storage, sharing, validation, theme, i18n
│   ├── ui/                # Shared UI components (StatCard, ToastProvider, ConfirmDialog)
│   ├── styles/            # Global styles
│   └── assets/            # Static assets
└── tests/                 # 🧪 Vitest specs
```

## 🛠️ Tech stack

### Frontend

-   **React 19.1.1** — the latest React features with concurrent-friendly APIs
-   **TypeScript 5.6** — strict typing for safer development
-   **Vite 7.1.3** — lightning-fast dev server and bundler
-   **Tailwind CSS 4.1.12** — utility-first styling with dark mode support
-   **React Router 7.9.3** — routing and deep-linking to shared sessions

### Architecture & tooling

-   **Feature-Sliced Design** — predictable project structure
-   **Path aliases** — ergonomic imports (`~entities/person`, `~shared/ui`)
-   **i18next + react-i18next** — localisation and runtime language switching
-   **ESLint** — modern linting setup with Feature-Sliced rules
-   **Vitest** — blazing-fast unit tests with jsdom
-   **PWA baseline** — service worker & manifest via Vite plugin

### UI / UX

-   **Lucide React** — flexible SVG icon set
-   **Responsive layout** — works great on desktop and mobile
-   **Gradient backgrounds** — polished look and feel
-   **Headless UI dialogs + toasts** — accessible overlays and notifications

## 📱 PWA status

Raspil ships with a **baseline PWA configuration**:

-   ✅ **Service Worker** — generated automatically via Vite PWA plugin
-   ✅ **Web App Manifest** — installable metadata
-   ✅ **Offline caching** — static assets cached out of the box
-   🔄 **Work in progress** — custom icons and advanced strategies can be added later

> **Note:** For a production-grade PWA, ship branded icons and tweak the caching strategy.

## 🧪 Testing

```bash
# Run tests
pnpm test

# Coverage report
pnpm test:coverage
```

> Need a single run without watch mode? Use `pnpm test:run`.

## 🔧 Available scripts

```bash
# Development
pnpm dev              # Start Vite dev server
pnpm build            # Production build
pnpm preview          # Preview the production bundle

# Code quality
pnpm lint             # Run ESLint

# Testing
pnpm test             # Vitest in watch mode
pnpm test:run         # Single run
pnpm test:coverage    # Coverage report
```

## 🎯 How to use

1. **Add participants** — click “Add person” and provide their names
2. **Enter expenses** — type the amount each person spent; invalid values highlight instantly
3. **Calculate** — hit “Calculate” to recompute balances
4. **Review transfers** — the summary shows who should pay and who should receive
5. **Share the result** — save the session and copy the shareable link
6. **Switch languages** — use the 🌐 icon in the header to toggle RU ↔ EN (stored in `localStorage`)
7. **Pick a theme** — toggle dark/light mode; the choice is remembered automatically

## 🌍 Localisation

-   Supports 🇷🇺 Russian and 🇬🇧 English with instant switching
-   The `LanguageToggle` feature persists the language in `localStorage`
-   All UI strings, exports (CSV/PDF) and sharing flows use i18next translations; add new keys in `~shared/lib/i18n.ts`
-   Blank session or participant names fall back to safe defaults (`Untitled session`, `Person {{id}}`)
-   Vitest initialises i18n via `src/tests/setup.ts`, so assertions should rely on `i18n.t(...)`

## 🔗 Export & sharing

-   **Link sharing** — “Share” generates a short URL (`/?data=...`) and copies it to the clipboard or opens the native share sheet
-   **QR code** — display a QR for quick sharing between devices
-   **CSV export** — UTF-8 BOM and structured columns (summary, participants, transfers); works nicely with Excel/Numbers
-   **PDF export** — printable report with cards, tables and coloured balances
-   All exports include the “who pays whom” list for offline reference

## 💡 UX highlights

-   **Dark / light theme** — stored in `localStorage`, toggled via the header
-   **Fade-in animations** — Tailwind keyframe `fade-in-up` for tables and session cards
-   **Inline validation** — prevents running calculations with invalid inputs
-   **Friendly notifications** — Headless UI dialogs and custom toasts

## 🌗 Theming for developers

-   Tailwind runs in `class` mode; `src/shared/styles/index.css` defines `@custom-variant dark (&:where(.dark, .dark *));`
-   `theme.apply()` from `~shared/lib/theme.ts` keeps the `.dark` class, `data-theme`, and `color-scheme` in sync on `<html>` / `<body>`
-   A pre-paint bootstrap in `index.html` avoids theme flashes on load
-   When adding global styles, rely on Tailwind tokens or `color-scheme` and respect the dark variant selector

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development guidelines

-   Follow the **Feature-Sliced Design** architecture
-   Use **TypeScript** with strict typing
-   Write **tests** for new behaviour
-   Keep the **ESLint** rules green

## 📄 License

Raspil is distributed under the **Raspil Commercial License v1.0**. See [LICENSE](LICENSE) for the full text. For production or commercial use, contact legal@pestov-web.com.

## 👨‍💻 Author

**pestov-web** — [GitHub](https://github.com/pestov-web)

---

<div align="center">

**Raspil** — splitting shared expenses made fair and effortless 💰✨

[🌟 Star](https://github.com/pestov-web/raspil) • [🐛 Report a bug](https://github.com/pestov-web/raspil/issues) • [💡 Share an idea](https://github.com/pestov-web/raspil/discussions)

</div>
