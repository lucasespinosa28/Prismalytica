import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { OHLCVDataPoint, TimeframeType } from '../hooks/usePoolOHLCVData';

interface CandlestickChartProps {
  data: OHLCVDataPoint[];
  width?: number;
  height?: number;
  timeframe?: TimeframeType;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  data, 
  width = 800, 
  height = 400,
  timeframe = 'hour'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Reverse data to show oldest to newest (left to right)
    const chartData = [...data].reverse();

    // Set margins
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.timestamp))
      .range([0, innerWidth])
      .padding(0.2);

    // Fix for TypeScript errors - safely handle potentially undefined min/max values
    const minLow = d3.min(chartData, d => d.low);
    const maxHigh = d3.max(chartData, d => d.high);
    const yScale = d3.scaleLinear()
      .domain([
        minLow !== undefined ? minLow * 0.99 : 0,
        maxHigh !== undefined ? maxHigh * 1.01 : 1
      ])
      .range([innerHeight, 0]);

    // Format date labels based on timeframe
    // Format date labels based on timeframe
    const formatDateLabel = (timestamp: string, index: number) => {
      try {
        // Parse the timestamp - handle various formats
        let date: Date;

        // Check if timestamp is in format "DD/MM/YYYY, HH:MM:SS"
        if (/\d{1,2}\/\d{1,2}\/\d{4},\s\d{1,2}:\d{2}:\d{2}/.test(timestamp)) {
          // Split the date and time parts
          const [datePart, timePart] = timestamp.split(', ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hours, minutes, seconds] = timePart.split(':').map(Number);

          // Create date using individual components (months are 0-indexed in JavaScript)
          date = new Date(year, month - 1, day, hours, minutes, seconds);
        }
        // Check if timestamp is already a formatted date string (like "Mon Jan 01 2023")
        else if (timestamp.includes(' ') && isNaN(Number(timestamp))) {
          date = new Date(timestamp);
        } else {
          // Try to parse as Unix timestamp (seconds or milliseconds)
          const timestampNum = parseInt(timestamp);
          date = new Date(timestampNum * (timestampNum < 10000000000 ? 1000 : 1));
        }

        if (isNaN(date.getTime())) {
          console.error("Invalid date:", timestamp);
          return timestamp;
        }

        // Skip some labels for readability based on data density
        const skipFactor = Math.ceil(chartData.length / 10);
        if (index % skipFactor !== 0) return '';

        // Format based on timeframe
        switch(timeframe) {
          case 'minute':
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          case 'hour':
            return `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:00`;
          case 'day':
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          default:
            return timestamp;
        }
      } catch (error) {
        console.error("Error formatting date:", error, "for timestamp:", timestamp);
        return timestamp;
      }
    };
    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat((d, i) => formatDateLabel(String(d), i));

    const yAxis = d3.axisLeft(yScale);

    // Add axes to chart
    svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .call(yAxis);

    // Add candlesticks
    svg.selectAll(".candle")
      .data(chartData)
      .enter()
      .append("line")
      .attr("class", "wick")
      .attr("x1", d => (xScale(d.timestamp) || 0) + xScale.bandwidth() / 2)
      .attr("x2", d => (xScale(d.timestamp) || 0) + xScale.bandwidth() / 2)
      .attr("y1", d => yScale(d.high))
      .attr("y2", d => yScale(d.low))
      .attr("stroke", d => d.open > d.close ? "red" : "green")
      .attr("stroke-width", 1);

    svg.selectAll(".candle")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "body")
      .attr("x", d => xScale(d.timestamp) || 0)
      .attr("y", d => yScale(Math.max(d.open, d.close)))
      .attr("width", xScale.bandwidth())
      .attr("height", d => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", d => d.open > d.close ? "red" : "green");

    // Add chart title
    const titleText = `OHLCV ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}ly Candlestick Chart`;
    svg.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(titleText);
  }, [data, width, height, timeframe]);

  return (
    <div className="candlestick-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CandlestickChart;