export interface OhlcvData {
    timestamp: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}

export interface ApiResponse {
    data: {
        attributes: {
            ohlcv_list: [number, number, number, number, number, number][];
        };
    };
}

export interface llmResponse {
    status: string,
    response: string,
  }
  