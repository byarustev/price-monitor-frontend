export interface Rate {
    currency: string;
    oldRate: number;
    newRate: number;
    changePercent: number;
    timestamp: string;
}

export interface Rates {
    [currency: string]: number;
}

export interface WebSocketMessage {
    type: 'rates' | 'rateChange';
    data: Rates | Rate;
} 