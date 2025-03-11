import React, { useState } from 'react';
import { fetchPoolOHLCVData, TimeframeType, OHLCVDataPoint } from '../hooks/usePoolOHLCVData';
import CandlestickChart from './CandlestickChart';
import { useCandleStore } from '../store/candleStore';

interface FetchOHLCVButtonProps {
  network?: string;
  poolAddress?: string;
  timeframe?: TimeframeType;
  aggregate?: number;
  limit?: number;
  currency?: string;
}

const FetchOHLCVButton: React.FC<FetchOHLCVButtonProps> = ({
  network = 'cro',
  poolAddress = '0xe61db569e231b3f5530168aa2c9d50246525b6d6',
  timeframe = 'hour',
  aggregate = 1,
  limit = 24,
  currency = 'usd'
}) => {
  const [data, setData] = useState<OHLCVDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCandle } = useCandleStore();

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ohlcvData = await fetchPoolOHLCVData(
        network,
        poolAddress,
        timeframe,
        aggregate,
        limit,
        currency
      );
      setData(ohlcvData);
      setCandle(JSON.stringify(ohlcvData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ohlcv-data-container">
      <button 
        onClick={handleFetchData}
        disabled={loading}
        className="fetch-button"
      >
        {loading ? 'Loading...' : 'Fetch OHLCV Data'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {data.length > 0 && (
        <div className="chart-container">
          <CandlestickChart 
            data={data} 
            timeframe={timeframe}
            width={800}
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default FetchOHLCVButton;