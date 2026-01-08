import WorkIcon from '@mui/icons-material/Work';
import { Diagnosis, Entry } from '../../types';

const OccupationalEntry: React.FC<{
  entry: Entry;
  diagnoses: Diagnosis[];
  style: React.CSSProperties;
}> = ({ entry, diagnoses, style }) => {
  if (entry.type !== 'OccupationalHealthcare') {
    return null;
  }
  return (
    <div key={entry.id} style={style}>
      <p>
        {entry.date} <WorkIcon /> {entry.employerName}
      </p>
      <p>
        <em>{entry.description}</em>
      </p>
      <p>Diagnosed by: {entry.specialist}</p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses.find((d) => d.code === code)?.name}
          </li>
        ))}
      </ul>
      <p>
        Sick leave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}
      </p>
    </div>
  );
};

export default OccupationalEntry;
