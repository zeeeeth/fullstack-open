import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Diagnosis, Entry } from '../../types';

const HospitalEntry: React.FC<{
  entry: Entry;
  diagnoses: Diagnosis[];
  style: React.CSSProperties;
}> = ({ entry, diagnoses, style }) => {
  if (entry.type !== 'Hospital') {
    return null;
  }
  return (
    <div key={entry.id} style={style}>
      <p>
        {entry.date} <LocalHospitalIcon />
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
        Discharge: {entry.discharge.date} - {entry.discharge.criteria}
      </p>
    </div>
  );
};

export default HospitalEntry;
