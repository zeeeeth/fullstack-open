type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy';

type Visibility = 'great' | 'good' | 'ok' | 'poor';

interface NonSensitiveDiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
}

import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    axios.get<NonSensitiveDiaryEntry[]>('http://localhost:3000/api/diaries')
      .then(response => {
        setDiaryEntries(response.data as NonSensitiveDiaryEntry[]);
      })
  }, [])

  return (
    <div>
      <h1>Flight Diary</h1>
      {diaryEntries.map(entry => {
        return (
          <div key={entry.id}>
            <h2>{entry.date}</h2>
            <p>Weather: {entry.weather}</p>
            <p>Visibility: {entry.visibility}</p>
          </div>
        )
      })}
    </div>
  )
}

export default App;