import { useEffect, useState } from 'react';
import patientService from '../../services/patients';
import {
  Patient,
  Entry,
  Diagnosis,
  NewEntry,
  HealthCheckRating,
} from '../../types';
import { useParams } from 'react-router-dom';
import EntryDetails from './EntryDetails';
import EntryForm from './EntryForm';
import Notification from './Notification';
import axios from 'axios';
import BasicInfo from './BasicInfo';

interface PatientInfoPageProps {
  diagnoses: Array<Diagnosis>;
}

const PatientInfoPage = ({ diagnoses }: PatientInfoPageProps) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<string>>([]);
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(0);
  const [type, setType] = useState<
    'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'
  >('HealthCheck');
  const [employerName, setEmployerName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      try {
        const fetchedPatient = await patientService.getById(id);
        setPatient(fetchedPatient);
      } catch (e) {
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) return <div>Loading patient information...</div>;
  if (!patient) return <div>Patient not found</div>;
  const { name, occupation, gender, ssn, dateOfBirth } = patient;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id) return;
    let newEntry: NewEntry;
    switch (type) {
      case 'HealthCheck':
        newEntry = {
          type: 'HealthCheck',
          description,
          date,
          specialist,
          diagnosisCodes,
          healthCheckRating,
        };
        break;
      case 'Hospital':
        newEntry = {
          type: 'Hospital',
          description,
          date,
          specialist,
          diagnosisCodes,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
        break;
      case 'OccupationalHealthcare':
        newEntry = {
          type: 'OccupationalHealthcare',
          description,
          date,
          specialist,
          diagnosisCodes,
          employerName,
          sickLeave: { startDate, endDate },
        };
        break;
      default:
        throw new Error('Invalid entry type');
    }

    if (
      newEntry.description.length === 0 ||
      newEntry.date.length === 0 ||
      newEntry.specialist.length === 0
    ) {
      setError('Description, date, and specialist are required fields.');
      return;
    }

    try {
      const addedEntry = await patientService.createEntry(id, newEntry);
      setPatient({ ...patient, entries: patient.entries.concat(addedEntry) });
      setDescription('');
      setDate('');
      setSpecialist('');
      setDiagnosisCodes([]);
      setHealthCheckRating(0);
      setType('HealthCheck');
      setEmployerName('');
      setStartDate('');
      setEndDate('');
      setDischargeDate('');
      setDischargeCriteria('');
      setError(null);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { error: string };
        setError(data?.error ?? e.message);
      } else {
        setError(e instanceof Error ? e.message : 'Unknown error occurred');
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    }
  };

  return (
    <div className="App">
      <BasicInfo
        name={name}
        gender={gender}
        ssn={ssn || 'N/A'}
        occupation={occupation}
        dateOfBirth={dateOfBirth || 'N/A'}
      />
      <Notification message={error || ''} />
      <EntryForm
        description={description}
        setDescription={setDescription}
        date={date}
        setDate={setDate}
        specialist={specialist}
        setSpecialist={setSpecialist}
        diagnosisCodes={diagnosisCodes}
        setDiagnosisCodes={setDiagnosisCodes}
        type={type}
        setType={setType}
        healthCheckRating={healthCheckRating}
        setHealthCheckRating={setHealthCheckRating}
        employerName={employerName}
        setEmployerName={setEmployerName}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        dischargeDate={dischargeDate}
        setDischargeDate={setDischargeDate}
        dischargeCriteria={dischargeCriteria}
        setDischargeCriteria={setDischargeCriteria}
        submit={submit}
        diagnoses={diagnoses}
      />
      <h3>Entries</h3>
      {patient.entries?.map((entry: Entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientInfoPage;
