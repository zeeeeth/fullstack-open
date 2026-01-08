import { Entry, Diagnosis } from '../../types';
import assertNever from '../../utils/assertNever';
import HospitalEntry from './HospitalEntry';
import HealthCheckEntry from './HealthcheckEntry';
import OccupationalEntry from './OccupationalEntry';

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Array<Diagnosis>;
}

const entryBox = {
  border: '1px solid black',
  marginBottom: '10px',
  padding: '10px',
};

const EntryDetails: React.FC<EntryDetailsProps> = ({
  entry,
  diagnoses,
}: EntryDetailsProps) => {
  switch (entry.type) {
    case 'Hospital':
      return (
        <HospitalEntry entry={entry} diagnoses={diagnoses} style={entryBox} />
      );
    case 'OccupationalHealthcare':
      return (
        <OccupationalEntry
          entry={entry}
          diagnoses={diagnoses}
          style={entryBox}
        />
      );
    case 'HealthCheck':
      return (
        <HealthCheckEntry
          entry={entry}
          diagnoses={diagnoses}
          style={entryBox}
        />
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
