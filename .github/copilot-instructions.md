# Инструкции Copilot для AI-код-агентов

## Общее описание

Это «Raspil» — калькулятор совместных расходов на React, собранный с помощью Vite и TypeScript и стилизованный Tailwind CSS. Пользователь может добавлять участников, учитывать их траты, получать автоматический расчёт «кто кому должен» и сохранять вычисления в повторы. Архитектура приложения — **Feature-Sliced Design (FSD)**, с строгой типизацией и слоями UI.

## Логика приложения и поток данных

-   **Ключевые сущности:**
    -   `Person` — поля `id`, `name`, `expenses` (строковый ввод), `duty` (рассчитанное число)
    -   `Session` — `id`, `name`, временные метки, снимок участников, суммарные значения и флаг вычисления
-   **Главное состояние:** хранится в `~pages/home/ui/HomePage.tsx` через `useState` (список участников и активная сессия)
-   **Основные операции:**
    -   Добавление/удаление участников (минимум один участник обязателен)
    -   Редактирование имени и суммы расходов
    -   Расчёт обязанностей: `perPersonShare - actualExpenses = duty`
    -   Положительное значение duty — участник должен доплатить, отрицательное — должен получить
    -   Автосохранение текущей сессии в LocalStorage на каждое изменение
    -   Сохранение/загрузка/удаление именных сессий, импорт/экспорт бэкапов
    -   Генерация шаринг-ссылок через корневой `/?data=...`; при загрузке приложение перенаправляет на `/share`
    -   Показ QR-кода для шаринга и экспорт расчёта в CSV/PDF

## Архитектура FSD и ключевые паттерны

-   **Точка входа:** `src/main.jsx` → `~app/main.tsx`, где инициируется React + StrictMode
-   **Слои FSD:**
    ```
    src/
    ├── app/                    # 🏗 Инициализация приложения
    │   ├── App.tsx            # Корневой компонент и провайдеры
    │   └── main.tsx           # Стартовая точка
    ├── pages/                 # 📄 Страницы-роуты
    │   ├── home/              # Главный калькулятор + состояние
    │   └── share-session/     # Импорт расчёта по ссылке
    ├── widgets/               # 🧩 Композитные UI-блоки
    │   ├── expense-calculator/ # Статистика и показатели
    │   ├── expense-summary/   # Итоги и переводы
    │   ├── people-manager/    # Кнопки добавления/расчёта
    │   ├── people-table/      # Таблица ввода данных
    │   ├── session-controls/  # Панель действий + мобильное меню
    │   └── session-manager/   # Модал управления сохранёнными сессиями
    ├── features/              # 🚀 Пользовательские сценарии
    │   ├── add-person/        # Создание участника
    │   ├── calculate-duties/  # Перерасчёт обязанностей
    │   ├── save-session/      # Сохранение текущего расчёта
    │   └── load-session/      # Восстановление сохранённой сессии
    ├── entities/              # 🎯 Бизнес-логика
    │   ├── person/            # Модель человека и утилиты
    │   └── session/           # Модель сессии, создание и метаданные
    └── shared/                # ⚡ Переиспользуемые ресурсы
        ├── lib/               # Бизнес-расчёты и helpers работы с хранилищем
        ├── ui/                # UI-компоненты (StatCard, ToastProvider, ConfirmDialog)
        ├── styles/            # Глобальный CSS
        └── types/             # Общие типы и декларации
    ```
-   **Правила импортов:** только «вниз» по слоям — `app → pages → widgets → features → entities → shared`
-   **Публичные API:** каждый слой экспортируется через `index.ts`

## Псевдонимы путей

-   **Настройка Vite/TypeScript:** используются FSD-алиасы
    ```typescript
    // вместо длинных относительных путей
    import type { Person } from '~entities/person';
    import { StatCard } from '~shared/ui';
    import { AddPersonButton } from '~features/add-person';
    ```
-   **Доступные алиасы:** `~app`, `~pages`, `~widgets`, `~features`, `~entities`, `~shared`

> Для работы с данными используйте helpers из `~shared/lib`, а типы/утилиты сессий — из `~entities/session`.

## Рабочий процесс разработчика

-   **Менеджер пакетов:** `pnpm` (`pnpm-lock.yaml` уже в репозитории)
-   **Разработка:** `pnpm dev` запускает dev-сервер Vite с HMR
-   **Сборка:** `pnpm build` создаёт оптимизированный продакшн-бандл
-   **Линтинг:** `pnpm lint` — ESLint с плагинами для React и Fast Refresh
-   **Тесты:** `pnpm test` — Vitest (пример — папка `src/tests`)
-   **Покрытие:** `pnpm test:coverage` — отчёт покрытия
-   **Предпросмотр:** `pnpm preview` — локальный сервер для прод-сборки
-   **PWA-проверка:** `pnpm build && pnpm preview` — быстрая валидация SW и манифеста

## Паттерны стилизации и UI

-   **Фреймворк:** Tailwind CSS v4.1.12 (Vite-плагин)
-   **Тёмная тема:** режим `class`; в `src/shared/styles/index.css` объявлено `@custom-variant dark (&:where(.dark, .dark *));`, а `theme.apply()` из `~shared/lib/theme.ts` синхронизирует класс и `data-theme` на `<html>` и `<body>`
-   **Дизайн-система:**
    -   Градиентные подложки (`bg-gradient-to-br`)
    -   Закругления (`rounded-xl`, `rounded-2xl`)
    -   Тени (`shadow-xl`)
    -   Цветовые состояния (красный — долг, зелёный — возврат)
-   **Иконки:** Lucide React (`Plus`, `Calculator`, `Users`, `MinusCircle`, `Calendar`, `DollarSign` и др.)
-   **Макеты:** адаптивные сетки, ограничение по ширине контейнеров
-   **Шаред-компоненты:** `~shared/ui/StatCard`, уведомления через `ToastProvider`, диалоги через `ConfirmDialog`

## Точки интеграции

-   **Vite:** React-плагин, Tailwind-плагин, FSD-алиасы, `vite-plugin-pwa`
-   **Роутинг:** `react-router-dom` для маршрутов `/` и `/share`; перед монтированием см. `bootstrapShareRoute` в `~app/main.tsx`, который переводит `/?data=...` на `/share`
-   **Уведомления и диалоги:** контекст из `ToastProvider`, подтверждения на Headless UI `Dialog`
-   **ESLint:** современная flat-конфигурация с правилами хуков
-   **TypeScript:** строгий режим, `.tsx` файлы, алиасы по слоям
-   **Vitest:** jsdom-окружение
-   **Хранение:** LocalStorage через `~shared/lib/storage` (без бэкенда)

## Специфические договорённости

-   **Слои FSD:**
    -   Логика сущностей — в `~entities/*/lib`
    -   Пользовательские действия — в `~features/*`
    -   Композитный UI — в `~widgets/*`
    -   Роутинг — в `~app/App.tsx`
    -   Общие утилиты (расчёты, storage, sharing) — в `~shared/lib`
-   **Генерация ID:** `createPerson()` (person) и `generateSessionId()` (session)
-   **Типобезопасность:**
    -   Типы импортируются через `import type {...}
    -   Повторно используемые типы сессий — в `~entities/session`
    -   Следите, чтобы импорты шли по алиасам
-   **Расчёты:**
    -   Бизнес-логика — `~shared/lib/calculations`
    -   Парсинг сумм: `parseFloat(person.expenses) || 0`
    -   Округление: `roundToCents()` (helpers из `calculations.ts`, избегаем ручного `Math.round`)
    -   Оптимальные переводы: `calculateTransfers(people)` возвращает список `TransferPlan`
-   **Persistence:**
    -   Используйте `storage` из `~shared/lib/storage`
    -   При восстановлении сессий возвращайте даты к `Date`
    -   Напрямую с `localStorage` не работаем
    -   Шаринг (`createShareUrl`, `decodeSessionFromShare`) — в `~shared/lib/share`
-   **Экспорт:**
    -   CSV/PDF собраны в `~shared/lib/export`; перед вызовом синхронизируйте сессию
    -   PDF использует `ensureRobotoFont` из `pdf-fonts.ts` (встроенный Roboto с `Identity-H`)
    -   CSV добавляет UTF-8 BOM; не забывайте про список переводов и корректное экранирование
-   **Обратная связь:**
    -   Не используйте `alert`/`prompt`/`confirm`; вместо этого `useToast` + Headless UI `Dialog`
    -   Для подтверждений (удаление, новая сессия) — `ConfirmDialog`
    -   При ошибке копирования ссылки — fallback-модал с ручным копированием
-   **PWA-ассеты:** держите `public/icon.svg`, `public/favicon.svg` и PNG-версии согласованными с `vite.config.js`

## Примеры кода

-   **Использование общих расчётов:**

    ```typescript
    import { calculateTransfers } from '~shared/lib/calculations';

    const transfers = calculateTransfers(people);
    transfers.forEach(({ debtor, creditor, amount }) => {
        // debtor.duty > 0, creditor.duty < 0, amount уже округлён
    });
    ```

-   **Новый виджет:**

    ```typescript
    // src/widgets/expense-stats/ui/ExpenseStats.tsx
    import type { Person } from '~entities/person';
    import { StatCard } from '~shared/ui';
    import { calculateTotalExpenses } from '~shared/lib/calculations';

    interface ExpenseStatsProps {
        people: Person[];
    }

    export const ExpenseStats = ({ people }: ExpenseStatsProps) => {
        const total = calculateTotalExpenses(people);
        return <StatCard icon={<Calculator size={20} />} title='Total' value={`${total.toFixed(2)} ₽`} />;
    };
    ```

-   **Структура новой feature:**

    ```
    src/features/calculate-duties/
    ├── ui/
    │   └── CalculateDutiesButton.tsx    // UI-компонент
    ├── model/                           // При необходимости бизнес-логика
    └── index.ts                         // Экспорт публичного API
    ```

-   **Сохранение именованной сессии:**

    ```typescript
    import type { Session } from '~entities/session';
    import type { Person } from '~entities/person';
    import { updateSession } from '~entities/session';
    import { storage } from '~shared/lib';

    const persistSession = (session: Session, people: Person[]) => {
        const payload = updateSession(session, {
            name: 'Отпуск на Алтае',
            people,
            isCalculated: people.some((person) => person.duty !== 0),
        });

        storage.saveNamedSession(payload);
    };
    ```

-   **Поделиться ссылкой:**

    ```typescript
    import { createShareUrl } from '~shared/lib';

    const shareSession = (session: Session) => {
        const link = createShareUrl(session);
        void navigator.clipboard.writeText(link);
    };
    ```

## Ключевые файлы и зависимости

-   **Вход:** `src/main.jsx` → `~app/main.tsx`
-   **Корневой компонент:** `~app/App.tsx` — RouterProvider для `/` и `/share`
-   **Главная страница:** `~pages/home/ui/HomePage.tsx`
-   **Страница импорта:** `~pages/share-session/ui/ShareSessionPage.tsx`
-   **Сущности:**
    -   `~entities/person/model/types.ts`
    -   `~entities/session/model/types.ts`
-   **Расчёты:** `~shared/lib/calculations.ts`
-   **Хранение:** `~shared/lib/storage.ts`
-   **Шаринг:** `~shared/lib/share.ts`
-   **UI-панель сессий:** `~widgets/session-controls/SessionControls.tsx`
-   **Конфиг:** `vite.config.js`
-   **Библиотеки:** React 19, React Router 7.9, Vite 7.1, TypeScript, Tailwind 4.1, Lucide Icons

---

Если какие-то соглашения неочевидны или требуют уточнения, дайте знать — расширим инструкцию.
