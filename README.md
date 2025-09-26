# 🧮 Raspil - Калькулятор расходов

<div align="center">

![Raspil Logo](https://img.shields.io/badge/💰-Raspil-4f46e5?style=for-the-badge&labelColor=white)

**Простой и удобный калькулятор для справедливого разделения общих расходов**

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.3-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)

![Feature-Sliced Design](https://img.shields.io/badge/Architecture-Feature--Sliced%20Design-success)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange)
![ESLint](https://img.shields.io/badge/ESLint-Configured-4b32c3?logo=eslint)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6e9f18?logo=vitest)

</div>

## 🌟 Возможности

-   👥 **Добавление участников** — легко добавляйте и удаляйте людей
-   💸 **Учет расходов** — вводите суммы, потраченные каждым участником
-   🧮 **Автоматический расчет** — справедливое разделение с учетом вкладов
-   💰 **Оптимальные переводы** — минимальное количество транзакций
-   📱 **PWA поддержка** — работает офлайн, можно установить как приложение
-   🎨 **Современный UI** — красивый интерфейс с Tailwind CSS
-   ⚡ **Быстрая работа** — мгновенные расчеты без серверных запросов

## 🚀 Быстрый старт

```bash
# Клонируйте репозиторий
git clone https://github.com/pestov-web/raspil.git

# Перейдите в папку проекта
cd raspil

# Установите зависимости
pnpm install

# Запустите в режиме разработки
pnpm dev
```

Откройте [http://localhost:5173](http://localhost:5173) в браузере

## 🏗️ Архитектура

Проект построен на основе **Feature-Sliced Design (FSD)** — современной методологии архитектуры фронтенд приложений:

```
src/
├── app/                    # 🏗 Инициализация приложения
│   ├── App.tsx            # Корневой компонент
│   └── main.tsx           # Точка входа
├── widgets/               # 🧩 Композитные UI-блоки
│   ├── expense-calculator/
│   ├── expense-summary/
│   ├── people-manager/
│   └── people-table/
├── features/              # 🚀 Бизнес-функции
│   ├── add-person/
│   └── calculate-duties/
├── entities/              # 🎯 Бизнес-сущности
│   └── person/            # Модель человека
├── shared/                # ⚡ Переиспользуемые ресурсы
│   ├── lib/               # Утилиты и расчеты
│   ├── ui/                # UI-компоненты
│   └── styles/            # Глобальные стили
```

## 🛠️ Технологический стек

### Frontend

-   **React 19.1.1** — современная версия React с последними возможностями
-   **TypeScript 5.6** — типизация для безопасности и удобства разработки
-   **Vite 7.1.3** — быстрая сборка и HMR для отличного DX
-   **Tailwind CSS 4.1.12** — utility-first CSS фреймворк

### Архитектура и инструменты

-   **Feature-Sliced Design** — масштабируемая архитектура
-   **Path Aliases** — удобные импорты (`~entities/person`, `~shared/ui`)
-   **ESLint** — статический анализ кода
-   **Vitest** — быстрое unit-тестирование
-   **PWA** — прогрессивное веб-приложение

### UI и UX

-   **Lucide React** — красивые SVG иконки
-   **Responsive Design** — адаптивная верстка
-   **Gradient Backgrounds** — современный дизайн
-   **Color-coded States** — интуитивная индикация долгов/возвратов

## 📱 PWA возможности

Raspil — это **Progressive Web App** с полной поддержкой офлайн режима:

-   📥 **Установка** — можно установить как нативное приложение
-   🔄 **Офлайн работа** — все расчеты работают без интернета
-   🎨 **Нативный вид** — полноэкранный режим без браузерной панели
-   🚀 **Быстрый запуск** — мгновенная загрузка после установки

## 🧪 Тестирование

```bash
# Запустить тесты
pnpm test

# Запустить тесты в watch режиме
pnpm test:watch

# Покрытие кода
pnpm test:coverage
```

## 🔧 Доступные команды

```bash
# Разработка
pnpm dev              # Запуск dev-сервера
pnpm build            # Сборка для продакшена
pnpm preview          # Предпросмотр prod-сборки

# Качество кода
pnpm lint             # Проверка ESLint
pnpm lint:fix         # Автоисправление ESLint
pnpm type-check       # Проверка типов TypeScript

# Тестирование
pnpm test             # Запуск тестов
pnpm test:ui          # Vitest UI
```

## 🎯 Как использовать

1. **Добавьте участников** — нажмите "Добавить человека" и введите имена
2. **Укажите расходы** — введите сумму, которую потратил каждый человек
3. **Рассчитайте** — нажмите "Рассчитать" для получения результатов
4. **Посмотрите переводы** — в сводке увидите, кто кому должен

### Пример расчета:

-   **Общий ужин:** 3000₽
-   **Алиса потратила:** 2000₽
-   **Боб потратил:** 1000₽
-   **Чарли потратил:** 0₽

**Результат:** Чарли должен 500₽ Алисе

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
