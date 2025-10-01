export const isValidExpenseInput = (rawValue: string): boolean => {
    const value = rawValue.trim();

    if (value === '') {
        return true;
    }

    const normalized = value.replace(',', '.');
    const parsed = Number(normalized);

    if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
        return false;
    }

    return parsed >= 0;
};
