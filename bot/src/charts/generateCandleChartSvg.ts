import { OhlcvData } from "../types";

export function generateCandleChartSvg(data: OhlcvData[]): string {
  const width = 1600; // Double the width
  const height = 1200; // Double the height
  const padding = 100; // Adjust padding for larger size
  const candleWidth = (width - 2 * padding) / data.length;

  const maxPrice = Math.max(...data.map(d => parseFloat(d.high)));
  const minPrice = Math.min(...data.map(d => parseFloat(d.low)));
  const maxVolume = Math.max(...data.map(d => parseFloat(d.volume)));

  const priceToY = (price: number) => {
    return height - padding - 400 - ((price - minPrice) / (maxPrice - minPrice)) * (height - 2 * padding - 400);
  };

  const volumeToY = (volume: number) => {
    return height - padding - 200 - (volume / maxVolume) * 200; // Adjusted to bring volume closer
  };

  const priceThreshold = (maxPrice - minPrice) * 0.05; // 5% of the price range as a threshold
  const volumeThreshold = maxVolume * 0.1; // 10% of the max volume as a threshold

  // Generate background grid lines
  const gridLines = [];
  for (let price = minPrice; price <= maxPrice; price += priceThreshold) {
    const y = priceToY(price);
    gridLines.push(`<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e0e0e0" stroke-width="1" />`);
  }

  const svgCandles = data.map((d, i) => {
    const x = padding + i * candleWidth;
    const openY = priceToY(parseFloat(d.open));
    const closeY = priceToY(parseFloat(d.close));
    const highY = priceToY(parseFloat(d.high));
    const lowY = priceToY(parseFloat(d.low));
    const volumeY = volumeToY(parseFloat(d.volume));

    const color = parseFloat(d.close) > parseFloat(d.open) ? 'green' : 'red';

    // Show timestamp only for the first, middle, and last data points
    const showTimestamp = i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1;

    return `
      <line x1="${x + candleWidth / 2}" y1="${highY}" x2="${x + candleWidth / 2}" y2="${lowY}" stroke="${color}" />
      <rect x="${x}" y="${Math.min(openY, closeY)}" width="${candleWidth * 0.8}" height="${Math.abs(closeY - openY)}" fill="${color}" />
      <rect x="${x}" y="${volumeY}" width="${candleWidth * 0.8}" height="${height - padding - 200 - volumeY}" fill="blue" />
      <text x="${x + candleWidth / 2}" y="${height - padding + 15}" font-size="10" text-anchor="middle" fill="black">${showTimestamp ? d.timestamp : ''}</text>
    `;
  }).join('');

  // Generate price labels on the left
  const priceLabels = [];
  for (let price = minPrice; price <= maxPrice; price += priceThreshold) {
    const y = priceToY(price);
    priceLabels.push(`<text x="${padding - 10}" y="${y}" font-size="10" text-anchor="end" fill="black">${price.toFixed(2)}</text>`);
  }

  // Generate volume labels on the left
  const volumeLabels = [];
  for (let volume = 0; volume <= maxVolume; volume += volumeThreshold) {
    const y = volumeToY(volume);
    volumeLabels.push(`<text x="${padding - 10}" y="${y}" font-size="10" text-anchor="end" fill="black">${volume.toFixed(0)}</text>`);
  }

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${gridLines.join('')}
      ${priceLabels.join('')}
      ${volumeLabels.join('')}
      ${svgCandles}
    </svg>
  `;
}