import { jsPDF } from 'jspdf';
import { ensureRobotoFont } from './pdf-fonts';
import { calculateTransfers } from './calculations';
import i18n from './i18n';
import type { TransferPlan } from './calculations';
import type { Person } from '~entities/person';
import type { Session } from '~entities/session';

interface SessionExportContext {
    session: Session;
    people: Person[];
    totalExpenses: number;
    perPersonShare: number;
}

type Alignment = 'left' | 'center' | 'right';
type RGB = [number, number, number];

interface TableColumn {
    title: string;
    width: number;
    align?: Alignment;
}

interface TableCell {
    text: string;
    align?: Alignment;
    textColor?: RGB;
}

interface SummaryCard {
    title: string;
    value: string;
    accent: RGB;
    background: RGB;
    caption?: string;
}

const COLORS = {
    text: [15, 23, 42] as RGB,
    muted: [71, 85, 105] as RGB,
    border: [226, 232, 240] as RGB,
    stripe: [248, 250, 252] as RGB,
    headerBlue: [37, 99, 235] as RGB,
    headerBlueText: [255, 255, 255] as RGB,
    headerGreen: [16, 185, 129] as RGB,
    headerGreenText: [255, 255, 255] as RGB,
    summaryBlueAccent: [59, 130, 246] as RGB,
    summaryBlueBg: [239, 246, 255] as RGB,
    summaryGreenAccent: [5, 150, 105] as RGB,
    summaryGreenBg: [236, 253, 245] as RGB,
    danger: [220, 38, 38] as RGB,
    success: [22, 163, 74] as RGB,
};

const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options) as string;

const formatCurrency = (value: number): string => `${value.toFixed(2)} ₽`;

const ensureBrowser = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error(t('exportDoc.browserOnly'));
    }
};

const buildFileName = (sessionName: string, extension: string) => {
    const normalized = sessionName.trim() ? sessionName.trim() : 'raspil-session';
    const slug = normalized
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');

    const timestamp = new Date().toISOString().slice(0, 10);
    return `${slug || 'raspil-session'}-${timestamp}.${extension}`;
};

const sanitizeDescription = (description?: string | null): string => {
    if (!description) return '—';
    const normalized = description.replace(/\s+/g, ' ').trim();
    return normalized.length > 0 ? normalized : '—';
};

const quoteCsvCell = (cell: string): string => `"${cell.replace(/"/g, '""')}"`;

const createCsvMatrix = (
    { session, people, totalExpenses, perPersonShare }: SessionExportContext,
    transfers: TransferPlan[]
): string[][] => {
    const matrix: string[][] = [];
    const sessionName = session.name?.trim() ? session.name : t('common.unnamedSession');
    matrix.push([t('exportDoc.csv.session'), sessionName, '']);
    matrix.push([t('exportDoc.csv.description'), sanitizeDescription(session.description), '']);
    matrix.push([t('exportDoc.csv.total'), formatCurrency(totalExpenses), '']);
    matrix.push([t('exportDoc.csv.perPerson'), formatCurrency(perPersonShare), '']);
    matrix.push([t('exportDoc.csv.transfersCount'), String(transfers.length), '']);
    matrix.push(['']);

    matrix.push([t('exportDoc.csv.name'), t('exportDoc.csv.expenses'), t('exportDoc.csv.duty')]);
    people.forEach((person) => {
        const name = person.name?.trim() ? person.name : t('common.personFallback', { id: person.id });
        const expenses = formatCurrency(parseFloat(person.expenses || '0') || 0);
        const dutyValue = person.duty ?? 0;
        matrix.push([name, expenses, formatCurrency(dutyValue)]);
    });

    matrix.push(['']);
    if (transfers.length > 0) {
        matrix.push([t('exportDoc.transfers.heading'), '', '']);
        matrix.push([
            t('exportDoc.transfers.payer'),
            t('exportDoc.transfers.receiver'),
            t('exportDoc.transfers.amount'),
        ]);
        transfers.forEach((transfer) => {
            const debtorName = transfer.debtor.name?.trim()
                ? transfer.debtor.name
                : t('common.personFallback', { id: transfer.debtor.id });
            const creditorName = transfer.creditor.name?.trim()
                ? transfer.creditor.name
                : t('common.personFallback', { id: transfer.creditor.id });
            matrix.push([debtorName, creditorName, formatCurrency(transfer.amount)]);
        });
    } else {
        matrix.push([t('exportDoc.transfers.none'), '', '']);
    }

    return matrix;
};

const applyBaseStyles = (doc: jsPDF) => {
    ensureRobotoFont(doc);
    doc.setFont('Roboto-Regular', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.text);
};

const getAlignedX = (x: number, width: number, align: Alignment, padding: number): number => {
    if (align === 'center') return x + width / 2;
    if (align === 'right') return x + width - padding;
    return x + padding;
};

const getAlignOption = (align: Alignment) => {
    switch (align) {
        case 'center':
            return 'center' as const;
        case 'right':
            return 'right' as const;
        default:
            return 'left' as const;
    }
};

const renderSummaryCards = (
    doc: jsPDF,
    {
        margin,
        startY,
        usableWidth,
        cards,
    }: { margin: number; startY: number; usableWidth: number; cards: SummaryCard[] }
): number => {
    const cardHeight = 92;
    const gap = 16;
    let y = startY;
    const bottomLimit = doc.internal.pageSize.getHeight() - margin;

    if (y + cardHeight > bottomLimit) {
        doc.addPage();
        applyBaseStyles(doc);
        y = margin;
    }

    const cardWidth = (usableWidth - gap * (cards.length - 1)) / cards.length;

    cards.forEach((card, index) => {
        const x = margin + index * (cardWidth + gap);
        doc.setFillColor(...card.background);
        doc.roundedRect(x, y, cardWidth, cardHeight, 12, 12, 'F');

        doc.setTextColor(...card.accent);
        doc.setFontSize(22);
        doc.text(card.value, x + cardWidth / 2, y + 42, { align: 'center' });

        doc.setFontSize(11);
        doc.text(card.title, x + cardWidth / 2, y + 64, { align: 'center' });

        if (card.caption) {
            doc.setFontSize(9);
            doc.setTextColor(...COLORS.muted);
            doc.text(card.caption, x + cardWidth / 2, y + 78, { align: 'center' });
        }

        doc.setFontSize(12);
        doc.setTextColor(...COLORS.text);
    });

    return y + cardHeight + 28;
};

const renderTable = (
    doc: jsPDF,
    {
        margin,
        startY,
        title,
        columns,
        rows,
        headerFill,
        headerTextColor,
        stripeFill = COLORS.stripe,
        rowHeight = 30,
        headerHeight = 34,
    }: {
        margin: number;
        startY: number;
        title: string;
        columns: TableColumn[];
        rows: TableCell[][];
        headerFill: RGB;
        headerTextColor: RGB;
        stripeFill?: RGB;
        rowHeight?: number;
        headerHeight?: number;
    }
): number => {
    if (rows.length === 0) {
        return startY;
    }

    const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);
    const bottomLimit = doc.internal.pageSize.getHeight() - margin;
    let y = startY;

    const drawHeader = () => {
        if (y + headerHeight + 20 > bottomLimit) {
            doc.addPage();
            applyBaseStyles(doc);
            y = margin;
        }

        doc.setFontSize(14);
        doc.setTextColor(...COLORS.text);
        doc.text(title, margin, y);
        y += 22;

        doc.setFillColor(...headerFill);
        doc.roundedRect(margin, y, tableWidth, headerHeight, 8, 8, 'F');

        const baseline = y + headerHeight / 2 + 4;
        doc.setFontSize(12);
        columns.forEach((column, index) => {
            const cellX = margin + columns.slice(0, index).reduce((sum, col) => sum + col.width, 0);
            const align = column.align ?? 'left';
            const textX = getAlignedX(cellX, column.width, align, 14);
            doc.setTextColor(...headerTextColor);
            doc.text(column.title, textX, baseline, { align: getAlignOption(align) });
        });

        doc.setTextColor(...COLORS.text);
        y += headerHeight;
    };

    const drawRow = (cells: TableCell[], rowIndex: number) => {
        if (y + rowHeight > bottomLimit) {
            doc.addPage();
            applyBaseStyles(doc);
            y = margin;
            drawHeader();
        }

        if (stripeFill && rowIndex % 2 === 0) {
            doc.setFillColor(...stripeFill);
            doc.rect(margin, y, tableWidth, rowHeight, 'F');
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(margin, y, tableWidth, rowHeight, 'F');
        }

        doc.setDrawColor(...COLORS.border);
        doc.line(margin, y + rowHeight, margin + tableWidth, y + rowHeight);

        const baseline = y + rowHeight / 2 + 4;
        columns.forEach((column, index) => {
            const cell = cells[index] ?? { text: '' };
            const cellX = margin + columns.slice(0, index).reduce((sum, col) => sum + col.width, 0);
            const align = cell.align ?? column.align ?? 'left';
            const textX = getAlignedX(cellX, column.width, align, 14);
            const textColor = cell.textColor ?? COLORS.text;
            doc.setTextColor(...textColor);
            doc.text(cell.text, textX, baseline, { align: getAlignOption(align) });
        });

        doc.setTextColor(...COLORS.text);
        y += rowHeight;
    };

    drawHeader();
    rows.forEach((row, index) => drawRow(row, index));

    return y + 24;
};

export const exportSessionAsCsv = (context: SessionExportContext) => {
    ensureBrowser();

    const transfers = calculateTransfers(context.people);
    const matrix = createCsvMatrix(context, transfers);
    const csvContent = '\ufeff' + matrix.map((row) => row.map(quoteCsvCell).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', buildFileName(context.session.name, 'csv'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const exportSessionAsPdf = (context: SessionExportContext) => {
    ensureBrowser();

    const transfers = calculateTransfers(context.people);
    const doc = new jsPDF({ unit: 'pt', compress: true, putOnlyUsedFonts: true });
    applyBaseStyles(doc);

    const margin = 48;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margin * 2;
    const bottomLimit = pageHeight - margin;

    let y = margin;
    const sessionName = context.session.name?.trim() ? context.session.name : t('common.unnamedSession');

    doc.setFontSize(20);
    doc.setTextColor(...COLORS.text);
    doc.text(sessionName, margin, y);
    y += 30;

    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    doc.text(t('exportDoc.descriptionLabel'), margin, y);
    y += 16;

    doc.setFontSize(12);
    doc.setTextColor(...COLORS.text);
    const descriptionLines = doc.splitTextToSize(sanitizeDescription(context.session.description), usableWidth);
    doc.text(descriptionLines, margin, y);
    y += descriptionLines.length * 16;

    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    y += 12;
    const exportDate = new Date().toLocaleDateString(i18n.language);
    doc.text(t('exportDoc.dateLabel', { date: exportDate }), margin, y);
    y += 24;

    doc.setFontSize(12);
    doc.setTextColor(...COLORS.text);
    y = renderSummaryCards(doc, {
        margin,
        startY: y,
        usableWidth,
        cards: [
            {
                title: t('exportDoc.summaryCards.total'),
                value: formatCurrency(context.totalExpenses),
                accent: COLORS.summaryBlueAccent,
                background: COLORS.summaryBlueBg,
            },
            {
                title: t('exportDoc.summaryCards.perPerson'),
                value: formatCurrency(context.perPersonShare),
                accent: COLORS.summaryBlueAccent,
                background: COLORS.summaryBlueBg,
            },
            {
                title: t('exportDoc.summaryCards.transfers'),
                value: String(transfers.length),
                accent: COLORS.summaryGreenAccent,
                background: COLORS.summaryGreenBg,
                caption:
                    transfers.length > 0
                        ? t('exportDoc.summaryCards.transfersCaption')
                        : t('exportDoc.summaryCards.transfersCaptionEmpty'),
            },
        ],
    });

    const nameColumnWidth = usableWidth * 0.45;
    const expenseColumnWidth = usableWidth * 0.25;
    const dutyColumnWidth = usableWidth - nameColumnWidth - expenseColumnWidth;

    const participantColumns: TableColumn[] = [
        { title: t('exportDoc.participants.name'), width: nameColumnWidth },
        { title: t('exportDoc.participants.expenses'), width: expenseColumnWidth, align: 'right' },
        { title: t('exportDoc.participants.duty'), width: dutyColumnWidth, align: 'right' },
    ];

    const participantRows: TableCell[][] = context.people.map((person) => {
        const name = person.name?.trim() ? person.name : t('common.personFallback', { id: person.id });
        const expenses = formatCurrency(parseFloat(person.expenses || '0') || 0);
        const dutyValue = person.duty ?? 0;
        const dutyColor = dutyValue > 0 ? COLORS.danger : dutyValue < 0 ? COLORS.success : COLORS.text;

        return [
            { text: name },
            { text: expenses, align: 'right' },
            { text: formatCurrency(dutyValue), align: 'right', textColor: dutyColor },
        ];
    });

    y = renderTable(doc, {
        margin,
        startY: y,
        title: t('exportDoc.participantsTitle'),
        columns: participantColumns,
        rows: participantRows,
        headerFill: COLORS.headerBlue,
        headerTextColor: COLORS.headerBlueText,
    });

    const transferColumnsWidth = usableWidth / 3;
    const transferColumns: TableColumn[] = [
        { title: t('exportDoc.transfers.payer'), width: transferColumnsWidth },
        { title: t('exportDoc.transfers.receiver'), width: transferColumnsWidth },
        { title: t('exportDoc.transfers.amount'), width: usableWidth - transferColumnsWidth * 2, align: 'right' },
    ];

    const transferRows: TableCell[][] = transfers.map((transfer) => {
        const debtorName = transfer.debtor.name?.trim()
            ? transfer.debtor.name
            : t('common.personFallback', { id: transfer.debtor.id });
        const creditorName = transfer.creditor.name?.trim()
            ? transfer.creditor.name
            : t('common.personFallback', { id: transfer.creditor.id });

        return [
            { text: debtorName },
            { text: creditorName },
            { text: formatCurrency(transfer.amount), align: 'right', textColor: COLORS.success },
        ];
    });

    if (transferRows.length > 0) {
        y = renderTable(doc, {
            margin,
            startY: y,
            title: t('exportDoc.transfers.title'),
            columns: transferColumns,
            rows: transferRows,
            headerFill: COLORS.headerGreen,
            headerTextColor: COLORS.headerGreenText,
        });
    } else {
        if (y + 40 > bottomLimit) {
            doc.addPage();
            applyBaseStyles(doc);
            y = margin;
        }

        doc.setFontSize(12);
        doc.setTextColor(...COLORS.success);
        doc.text(t('exportDoc.transfers.none'), margin, y);
        doc.setTextColor(...COLORS.text);
        y += 24;
    }

    if (y + 40 > bottomLimit) {
        doc.addPage();
        applyBaseStyles(doc);
        y = margin;
    }

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.muted);
    doc.text(t('exportDoc.footer'), margin, pageHeight - margin + 10);

    doc.save(buildFileName(context.session.name, 'pdf'));
};
