export function formatNumber(num: number): string {
  if (num === 0) return '0';
  const parts = num.toString().split('e');
  if (parts.length === 2) {
    // Handle scientific notation
    const mantissa = parseFloat(parts[0]);
    const exponent = parseInt(parts[1]);
    if (exponent < 0) {
      return mantissa.toFixed(4 - exponent).replace(/\.?0+$/, '');
    }
  }
  const match = num.toString().match(/^0\.0*/);
  if (match) {
    const leadingZeros = match[0].length - 2;
    return num.toFixed(leadingZeros + 4).replace(/\.?0+$/, '');
  }
  return num.toFixed(4).replace(/\.?0+$/, '');
}