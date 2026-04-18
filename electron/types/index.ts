export interface FloatWindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StockItem {
  code: string;
  name: string;
}

export interface StockData {
  name: string;
  code: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

export interface StoreSchema {
  floatWindowBounds: FloatWindowBounds;
  stockList: StockItem[];
  pollIntervalMs: number;
}
