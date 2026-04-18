import { StockData } from './types';

export function getTrendEmoji(isUp: boolean | null): string {
  if (isUp === true) return '📈';
  if (isUp === false) return '📉';
  return '▪';
}

export function formatStockDisplay(stockData: StockData): string {
  const emoji = getTrendEmoji(stockData.change > 0 ? true : stockData.change < 0 ? false : null);

  return (
    emoji +
    ' ' +
    stockData.name +
    ' ' +
    stockData.price +
    ' ' +
    stockData.change +
    ' (' +
    stockData.changePercent +
    '%)'
  );
}