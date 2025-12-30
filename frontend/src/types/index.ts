export interface Stock {
  symbol: string;
  name: string;
  price: number;
  changePerc: number;
  targetPrice: number;
  divRate: number;
  divGrowth: number;
  yearsDivGrowth: number;
  creditRating: string;
  comment: string;
  level: 'WATCH' | 'GOAL' | 'BENCH';
}

export interface Position {
  symbol: string;
  stockName: string;
  noOfShares: number;
  currentCost: number;
  totalCost: number;
  costPerShare: number;
  currentValue: number;
  unrealizedResult: number;
  unrealizedResultPercentage: number;
  totalIncome: number;
  annualIncome: number;
  yieldOnCost: number;
  totalReturn: number;
}

export interface Transaction {
  id: number;
  date: number;
  symbol: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  noOfShares: number;
  price: number;
  cost: number;
}

export interface Portfolio {
  currentCost: number;
  currentValue: number;
  currentResult: number;
  currentResultPercentage: number;
  totalCost: number;
  annualIncome: number;
  totalIncome: number;
  yieldOnCost: number;
  realizedResult: number;
  totalReturn: number;
  totalReturnPercentage: number;
}
