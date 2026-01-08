import patients from '../data/patients';
import {
  Patient,
  NonSensitivePatient,
  NewPatient,
  NewEntry,
  Entry,
  HealthCheckRating,
} from '../types';
import { v4 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
    entries: [],
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }
  if (entry.type === 'HealthCheck') {
    const rating = entry.healthCheckRating;
    const allowed = Object.values(HealthCheckRating).filter(
      (v): v is number => typeof v === 'number'
    );
    if (!allowed.includes(rating)) {
      throw new Error('Invalid health check rating');
    }
  }

  const newEntry = {
    id: uuid(),
    ...entry,
  };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  getPatientById,
  addPatient,
  addEntry,
};
