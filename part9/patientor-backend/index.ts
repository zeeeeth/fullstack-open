import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import diagnosisService from './services/diagnosisService';
import patientService from './services/patientService';
import { z } from 'zod';
import { NewPatientSchema } from './utils/toNewPatient';
import { Patient, NewPatient, Entry, NewEntry, Diagnosis } from './types';
import { NewEntrySchema } from './utils/toNewEntry';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

const errorMiddleWare = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.send(diagnosisService.getDiagnoses());
});

app.get('/api/patients', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

app.get('/api/patients/:id', (req: Request<{ id: string }>, res) => {
  res.send(patientService.getPatientById(req.params.id));
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

app.post(
  '/api/patients',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const newEntryParser = (
  req: Request<{ id: string }, unknown, unknown>,
  _res: Response,
  next: NextFunction
) => {
  if (!req.body || typeof req.body !== 'object' || !('type' in req.body)) {
    next(new Error('Entry type is missing'));
    return;
  }
  try {
    const diagnosisCodes = parseDiagnosisCodes(req.body);
    const bodyWithDiagnoses = { ...req.body, diagnosisCodes };
    NewEntrySchema.parse(bodyWithDiagnoses);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

app.post(
  '/api/patients/:id/entries',
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, NewEntry>,
    res: Response<Entry | { error: string }>
  ) => {
    try {
      const addedEntry = patientService.addEntry(req.params.id, req.body);
      res.json(addedEntry);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      res.status(400).send({ error: message });
    }
  }
);

app.use(errorMiddleWare);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
