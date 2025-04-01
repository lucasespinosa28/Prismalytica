import { OhlcvData } from "../types";

export function convertOHLCVToCSV(ohlcvData: OhlcvData[]): string {
    if (ohlcvData.length === 0) return '';

    const headers = ['Timestamp', 'Open', 'High', 'Low', 'Close', 'Volume'];
    const csvRows = [headers.join(',')];

    for (const data of ohlcvData) {
        const row = [
            data.timestamp,
            data.open,
            data.high,
            data.low,
            data.close,
            data.volume
        ];
        csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
}
