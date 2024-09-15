export interface PriceVolumeData {
    timestamp: string;
    price: number;
    volume: number;
    VWAP: number;
    HighPrice: number;
    LowPrice: number;
  }
  
  export interface BoardData {
    timestamp: string;
    OverSellQty: number;
    UnderBuyQty: number;
    [key: `Sell${number}_Price`]: number;
    [key: `Sell${number}_Qty`]: number;
    [key: `Buy${number}_Price`]: number;
    [key: `Buy${number}_Qty`]: number;
  }
  
  export interface Data {
    priceVolumeData: PriceVolumeData[];
    boardData: BoardData[];
    lastEvaluatedKeys?: {
      priceVolume: string | null;
      boardData: string | null;
    };
  }
  
  export interface ApiResponse {
    data: PriceVolumeData[] | BoardData[];
    last_evaluated_key: string | null;
  }