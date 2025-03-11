import React, { useState, useEffect } from 'react';
import { TimeframeType } from '../hooks/usePoolOHLCVData';

interface OHLCVFormProps {
  onChange: (params: {
    network: string;
    poolAddress: string;
    timeframe: TimeframeType;
    aggregate: number;
    limit: number;
    currency: string;
  }) => void;
  initialValues: {
    network: string;
    poolAddress: string;
    timeframe: TimeframeType;
    aggregate: number;
    limit: number;
    currency: string;
  };
}

const OHLCVForm: React.FC<OHLCVFormProps> = ({ onChange, initialValues }) => {
  const [poolAddress, setPoolAddress] = useState<string>(initialValues.poolAddress);
  const [timeframe, setTimeframe] = useState<TimeframeType>(initialValues.timeframe);
  const [aggregate, setAggregate] = useState<number>(initialValues.aggregate);
  const [limit, setLimit] = useState<number>(initialValues.limit);

  // Available aggregate values based on timeframe
  const aggregateOptions = {
    day: [1],
    hour: [1, 4, 12],
    minute: [1, 5, 15]
  };

  // Update aggregate when timeframe changes
  useEffect(() => {
    // Set default aggregate value when timeframe changes
    setAggregate(aggregateOptions[timeframe][0]);
  }, [timeframe]);

  // Call onChange whenever any value changes
  useEffect(() => {
    onChange({
      network: "cro",
      poolAddress,
      timeframe,
      aggregate,
      limit,
      currency: "usd"
    });
  }, [poolAddress, timeframe, aggregate, limit, onChange]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col">
        <label htmlFor="poolAddress" className="mb-1 text-sm font-medium text-gray-700">
          Pool Address:
        </label>
        <input
          id="poolAddress"
          type="text"
          value={poolAddress}
          onChange={(e) => setPoolAddress(e.target.value)}
          placeholder="Enter pool address"
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="timeframe" className="mb-1 text-sm font-medium text-gray-700">
            Timeframe:
          </label>
          <select
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as TimeframeType)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="day">Day</option>
            <option value="hour">Hour</option>
            <option value="minute">Minute</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="aggregate" className="mb-1 text-sm font-medium text-gray-700">
            Aggregate:
          </label>
          <select
            id="aggregate"
            value={aggregate}
            onChange={(e) => setAggregate(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {aggregateOptions[timeframe].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="limit" className="mb-1 text-sm font-medium text-gray-700">
            Limit:
          </label>
          <input
            id="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(Math.min(1000, Math.max(1, Number(e.target.value))))}
            min="1"
            max="1000"
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <span className="mt-1 text-xs text-gray-500">Maximum: 1000</span>
        </div>
      </div>
    </div>
  );
};

export default OHLCVForm;