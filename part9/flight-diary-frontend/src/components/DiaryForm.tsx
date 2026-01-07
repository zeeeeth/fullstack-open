import { Weather, Visibility } from '../types';

interface DiaryFormProps {
  setDate: React.Dispatch<React.SetStateAction<string>>;
  setWeather: React.Dispatch<React.SetStateAction<Weather | ''>>;
  setVisibility: React.Dispatch<React.SetStateAction<Visibility | ''>>;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  date: string;
  weather: Weather | '';
  visibility: Visibility | '';
  comment: string;
  submit: (event: React.SyntheticEvent) => Promise<void>;
}

const DiaryForm = ({
  setDate,
  setWeather,
  setVisibility,
  setComment,
  submit,
  date,
  weather,
  visibility,
  comment,
}: DiaryFormProps) => {
  return (
    <div>
      <h2>Add new entry</h2>
      <div>
        <form onSubmit={submit}>
          <div>
            date{' '}
            <input
              type="date"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
          </div>
          <div>
            weather{' '}
            {Object.values(Weather).map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  checked={weather === option}
                  onChange={({ target }) => setWeather(target.value as Weather)}
                />
                {option}
              </label>
            ))}
          </div>
          <div>
            visibility{' '}
            {Object.values(Visibility).map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  checked={visibility === option}
                  onChange={({ target }) =>
                    setVisibility(target.value as Visibility)
                  }
                />
                {option}
              </label>
            ))}
          </div>
          <div>
            comment{' '}
            <input
              type="text"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
            />
          </div>
          <button type="submit">add</button>
        </form>
      </div>
    </div>
  );
};

export default DiaryForm;
