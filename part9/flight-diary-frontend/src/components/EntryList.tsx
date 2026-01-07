import type { NonSensitiveDiaryEntry } from "../types";

interface EntryListProps {
    diaryEntries: NonSensitiveDiaryEntry[];
}

const EntryList = ({ diaryEntries }: EntryListProps) => {
    return (
        <div>
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

export default EntryList;