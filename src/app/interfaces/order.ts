export interface Order {
  status: OrderStatus;
  type: OrderType;
  transactionType: OrderTransactionType;
  amount?: number;
  limit?: number;
  stop?: number;
  transactionPrice?: number;
  transactionTotal?: number;
}

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP_LIMIT = 'STOP_LIMIT'
}

export enum OrderTransactionType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderStatus {
  STOP = 'STOP',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ERROR = 'ERROR'
}
