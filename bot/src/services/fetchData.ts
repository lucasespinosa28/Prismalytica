import { formatNumber } from "../utils/formatNumber";
import { convertOHLCVToCSV } from "../utils/convertOHLCVToCSV";
import { ApiResponse, OhlcvData } from "../types";

export async function fetchData(pool: string, timeframe: string, aggregate: number, limit: number): Promise<{ json: OhlcvData[]; csv: string; }> {
  const url = `https://api.geckoterminal.com/api/v2/networks/cro/pools/${pool}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=${limit}&currency=usd`;
  console.log(`Fetching data from URL: ${url}`);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching data: ${response.status} - ${response.statusText}. Response: ${errorText}`);
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const jsonData = await response.json() as ApiResponse;
    const ohlcv_list = jsonData.data.attributes.ohlcv_list.map((ohlcv) => {
      const date = new Date(ohlcv[0] * 1000);
      const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(date).replace(',', '');
      return {
        timestamp: formattedTimestamp,
        open: formatNumber(ohlcv[1]),
        high: formatNumber(ohlcv[2]),
        low: formatNumber(ohlcv[3]),
        close: formatNumber(ohlcv[4]),
        volume: formatNumber(ohlcv[5])
      };
    }).reverse();

    console.log(`Fetched ${ohlcv_list.length} OHLCV records.`);
    return { json: ohlcv_list, csv: convertOHLCVToCSV(ohlcv_list) };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in fetchData:', error.message);
      throw new Error(`Error fetching data: ${error.message}`);
    } else {
      console.error('Unknown error in fetchData:', error);
      throw new Error('An unknown error occurred while fetching data.');
    }
  }
}