export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';

export type NonSensitiveDiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export type NewDiaryEntry = Omit<NonSensitiveDiaryEntry, 'id'>;