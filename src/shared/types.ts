export type UserTokens = {
  xAuthToken: string;
  xRefreshToken: string;
};

export enum KegSizes {
  HALF_BARREL = '1/2 Barrel',
  QUARTER_BARREL = '1/4 Barrel',
  EIGHTH_BARREL = '1/8 Barrel',
  PONY_KEG = 'Pony Keg',
  CORNELIOUS_KEG = 'Cornelious Keg',
}

export type KegUpdate = {
  beersDrank: number;
  beersLeft: number;
  date: Date;
  id: string;
  kegId: string;
  kegSize: string;
  percLeft: number;
  temp: number;
  weight: number;
};

export interface SummaryData {
  summary: Summary;
}
export interface Summary {
  dailyData: DailyDataEntity[];
  dailyBeers: DailyWeeklyOrMonthlyBeers;
  weeklyData: WeeklyDataEntity[];
  weeklyBeers: DailyWeeklyOrMonthlyBeers;
  monthlyData: MonthlyDataEntity[];
  monthlyBeers: MonthlyDataEntity;
}
export interface DailyDataEntity {
  createdAt: string;
  beersdrank: number;
}
export interface WeeklyDataEntity {
  week: string;
  beersdrank: number;
}
export interface DailyWeeklyOrMonthlyBeers {
  beersdrank: string | null;
}
export interface MonthlyDataEntity {
  month: number;
  beersdrank: string;
}

export const Months = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export type Keg = {
  beerType: string;
  customTare: number;
  data: KegData | KegUpdate;
  id: string;
  kegSize: string;
  location: string;
  userId: string;
  subscribed: boolean;
  notifications: KegNotification;
};

export type KegNotification = {
  id: string;
  kegId: string;
  firstPerc: number;
  secondPerc: number;
  firstNotifComplete: boolean;
  secondNotifComplete: boolean;
  date: Date;
};

export type KegData = {
  beersDrank: number;
  beersLeft: number;
  date: Date;
  id: string;
  kegId: string;
  kegSize: string;
  percLeft: number;
  temp: number;
  weight: number;
};


export enum KegEvents {
  KEG_UPDATE = 'keg.update',
  KEG_CONNECT = 'keg.connect',
  KEG_DISCONNECT = 'keg.disconnect'
}