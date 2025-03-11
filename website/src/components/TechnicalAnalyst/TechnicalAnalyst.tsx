import React, { useState } from 'react';
import OHLCVForm from '../OHLCVForm';
import FetchOHLCVButton from '../FetchOHLCVButton';
import { TimeframeType } from '../../hooks/usePoolOHLCVData';
// Remove the CSS import since we'll use Tailwind CSS
// import './TechnicalAnalyst.css';

const TechnicalAnalyst: React.FC = () => {
  // OHLCV params state
  const [ohlcvParams, setOhlcvParams] = useState({
    network: "cro",
    poolAddress: "0xe61db569e231b3f5530168aa2c9d50246525b6d6",
    timeframe: "day" as TimeframeType,
    aggregate: 1,
    limit: 100,
    currency: "usd"
  });

  return (
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            OHLCV CRO/USDC Data Explorer
          </h2>

          <div className="space-y-6 w-full">
            <OHLCVForm 
              onChange={setOhlcvParams} 
              initialValues={ohlcvParams}
            />
            <div className="flex justify-center mt-4">
              <FetchOHLCVButton 
                network={ohlcvParams.network}
                poolAddress={ohlcvParams.poolAddress}
                timeframe={ohlcvParams.timeframe}
                aggregate={ohlcvParams.aggregate}
                limit={ohlcvParams.limit}
                currency={ohlcvParams.currency}
              />
            </div>
          </div>
        </div>
  );
};

export default TechnicalAnalyst;