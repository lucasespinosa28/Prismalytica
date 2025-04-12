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

export interface VolumeUSD {
    h24: string;
}

// Type for the attributes of a token
export interface TokenAttributes {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image_url: string;
    coingecko_coin_id: string | null;
    total_supply: string;
    price_usd: string;
    fdv_usd: string;
    total_reserve_in_usd: string;
    volume_usd: VolumeUSD;
    market_cap_usd: string | null;
}

// Type for the relationship data
export interface RelationshipData {
    id: string;
    type: string;
}

// Type for the relationships of a token
export interface TokenRelationships {
    top_pools: {
        data: RelationshipData[];
    };
}

// Type for a token
export interface Token {
    id: string;
    type: string;
    attributes: TokenAttributes;
    relationships: TokenRelationships;
}

// Type for the API response
export interface TokenApiResponse {
    data: Token[];
}

export interface responseTokens {
    name: string;
    symbol: string;
    price_usd: string;
    top_pools: string;
}

export interface CoinData {
    symbol: string;
    name: string;
    pool: string;
}

// List of supported cryptocurrencies
export const CoinsData: CoinData[] = [
    { symbol: 'CRO', name: 'Cronos Coin', pool: "0xe61db569e231b3f5530168aa2c9d50246525b6d6" },
    { symbol: 'BTC', name: 'Bitcoin', pool: "0x8f09fff247b8fdb80461e5cf5e82dd1ae2ebd6d7" },
    { symbol: 'ETH', name: 'Ethereum', pool: "0xa111c17f8b8303280d3eb01bbcd61000aa7f39f9" }
];

export type State = {
    privateKey: string;
    step: number;
    csvData: string | null;
    lastActivity: number;
    dailyCredit: number;
};

export interface LLMResponse {
    response: string;
}
