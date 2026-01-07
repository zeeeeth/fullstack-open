import { useState, useEffect } from 'react';
import type { NonSensitiveDiaryEntry, Weather, Visibility } from './types';
import { getAllDiaries, createDiary } from './services/diary';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchDiaries = async () => {
      setDiaryEntries(await getAllDiaries() as NonSensitiveDiaryEntry[]);
    };
    fetchDiaries();
  }, []);

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diaryToAdd = {
      date,
      weather: weather as Weather,
      visibility: visibility as Visibility,
      comment
    }
    const addedDiary = await createDiary(diaryToAdd)
    const addedDiaryEntry = addedDiary as NonSensitiveDiaryEntry;
    setDiaryEntries(diaryEntries.concat(addedDiaryEntry));
    setDate('');
    setWeather('');
    setVisibility('');
    setComment('');
  }

  return (
    <div>
      <h1>Flight Diary</h1>
      <h2>Add new entry</h2>
      <div>
        <form onSubmit={submit}>
          <div>
            date{" "}
            <input type="text" value={date} onChange={({ target }) => setDate(target.value)} />
          </div>
          <div>
            weather{" "}
            <input type="text" value={weather} onChange={({ target }) => setWeather(target.value)} />
          </div>
          <div>
            visibility{" "}
            <input type="text" value={visibility} onChange={({ target }) => setVisibility(target.value)} />
          </div>
          <div>
            comment{" "}
            <input type="text" value={comment} onChange={({ target }) => setComment(target.value)} />
          </div>
          <button type="submit">add</button>
        </form>
      </div>

      <h2>Diary Entries</h2>
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