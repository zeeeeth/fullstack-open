interface DiaryFormProps {
  setDate: React.Dispatch<React.SetStateAction<string>>;
  setWeather: React.Dispatch<React.SetStateAction<string>>;
  setVisibility: React.Dispatch<React.SetStateAction<string>>;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  date: string;
  weather: string;
  visibility: string;
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
              type="text"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
          </div>
          <div>
            weather{' '}
            <input
              type="text"
              value={weather}
              onChange={({ target }) => setWeather(target.value)}
            />
          </div>
          <div>
            visibility{' '}
            <input
              type="text"
              value={visibility}
              onChange={({ target }) => setVisibility(target.value)}
            />
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
