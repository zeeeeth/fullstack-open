import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import HealthRatingBar from '../HealthRatingBar';
import { Diagnosis, Entry } from '../../types';

const HealthCheckEntry: React.FC<{
  entry: Entry;
  diagnoses: Diagnosis[];
  style: React.CSSProperties;
}> = ({ entry, diagnoses, style }) => {
  if (entry.type !== 'HealthCheck') {
    return null;
  }
  return (
    <div key={entry.id} style={style}>
      <p>
        {entry.date} <MedicalInformationIcon />
      </p>
      <p>
        <em>{entry.description}</em>
      </p>
      <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
      <p>Diagnosed by: {entry.specialist}</p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses.find((d) => d.code === code)?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthCheckEntry;
