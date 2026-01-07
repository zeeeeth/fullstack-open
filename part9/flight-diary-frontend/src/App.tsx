import { useState, useEffect } from 'react';
import type { NonSensitiveDiaryEntry, Weather, Visibility } from './types';
import { getAllDiaries, createDiary } from './services/diary';
import EntryList from './components/EntryList';
import DiaryForm from './components/DiaryForm';
import Notification from './components/Notification';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>(
    []
  );
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await getAllDiaries();
        setDiaryEntries(data);
      } catch (error) {
        setError((error as Error).message);
        setTimeout(() => setError(''), 5000);
      }
    };
    fetchDiaries();
  }, []);

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const diaryToAdd = {
        date,
        weather: weather as Weather,
        visibility: visibility as Visibility,
        comment,
      };
      const addedDiary = await createDiary(diaryToAdd);
      const addedDiaryEntry = addedDiary as NonSensitiveDiaryEntry;
      setDiaryEntries(diaryEntries.concat(addedDiaryEntry));
      setDate('');
      setWeather('');
      setVisibility('');
      setComment('');
    } catch (error) {
      setError((error as Error).message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div>
      <h1>Flight Diary</h1>
      <Notification message={error} />
      <DiaryForm
        setDate={setDate}
        setWeather={setWeather}
        setVisibility={setVisibility}
        setComment={setComment}
        submit={submit}
        date={date}
        weather={weather}
        visibility={visibility}
        comment={comment}
      />
      {diaryEntries && <EntryList diaryEntries={diaryEntries} />}
    </div>
  );
};

export default App;
