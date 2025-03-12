import { useQuery } from '@tanstack/react-query';
// Remove the import since we won't use it in this function
// import { useTextStore } from '../store/textStore';

/**
 * Types for OHLCV data
 */
export interface OHLCVDataPoint {
   timestamp: string;
   open: number;
   high: number;
   low: number;
   close: number;
   volume: number;
}

export interface GeckoTerminalResponse {
  data: {
    attributes: {
      ohlcv_list: Array<[number, number, number, number, number, number]>;
    }
  }
}

export type TimeframeType = 'hour' | 'minute' | 'day';

/**
 * Fetches hourly OHLCV data for a specific pool from GeckoTerminal API
 * @param network The blockchain network (e.g., 'cro')
 * @param poolAddress The pool address
 * @param timeframe Time interval for data points ('hour', 'minute', or 'day')
 * @param aggregate Aggregation period in hours
 * @param limit Number of data points to return
 * @param currency Currency for price data (e.g., 'usd')
 * @returns Promise with the OHLCV data
 */
export async function fetchPoolOHLCVData(
    network: string = "cro",
    poolAddress: string = "0xe61db569e231b3f5530168aa2c9d50246525b6d6",
    timeframe: TimeframeType = 'hour',
    aggregate: number = 1,
    limit: number = 168,
    currency: string = 'usd'
): Promise<OHLCVDataPoint[]> {
    // Remove the useTextStore hook call
    const url = `https://api.geckoterminal.com/api/v2/networks/${network}/pools/${poolAddress}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=${limit}&currency=${currency}`;
    const headers = {
        'accept': 'application/json'
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiResponse = await response.json() as GeckoTerminalResponse;
        const ohlcvList = apiResponse.data.attributes.ohlcv_list;
        const data = ohlcvList.map((item) => {
            // Typical OHLCV format: [timestamp, open, high, low, close, volume]
            if (item.length < 6) {
                throw new Error('Invalid OHLCV data format');
            }
            const timestamp = new Date(item[0] * 1000);
            return {
                timestamp: `${timestamp.toUTCString()} ${timestamp.getHours()}`,
                open: parseFloat(item[1].toFixed(4)),
                high: parseFloat(item[2].toFixed(4)),
                low: parseFloat(item[3].toFixed(4)),
                close: parseFloat(item[4].toFixed(4)),
                volume: parseFloat(item[5].toFixed(4))
            };
        });
        console.log('Fetched pool OHLCV data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching pool OHLCV data:', error);
        throw error;
    }
}

/**
 * React hook for fetching OHLCV data with React Query
 * @param network The blockchain network (e.g., 'cro')
 * @param poolAddress The pool address
 * @param timeframe Time interval for data points ('hour', 'minute', or 'day')
 * @param aggregate Aggregation period in hours
 * @param limit Number of data points to return
 * @param currency Currency for price data (e.g., 'usd')
 * @returns Query result with OHLCV data
 */
export function usePoolOHLCVData(
    network: string = "cro",
    poolAddress: string = "0xe61db569e231b3f5530168aa2c9d50246525b6d6",
    timeframe: TimeframeType = 'hour',
    aggregate: number = 1,
    limit: number = 168,
    currency: string = 'usd',
    options = {}

) {
    return useQuery({
        queryKey: ['poolOHLCV', network, poolAddress, timeframe, aggregate, limit, currency],
        queryFn: () => fetchPoolOHLCVData(network, poolAddress, timeframe, aggregate, limit, currency),
        ...options
    });
}