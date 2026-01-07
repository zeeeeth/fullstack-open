import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import diagnosisService from './services/diagnosisService';
import patientService from './services/patientService';
import { z } from 'zod';
import { NewPatientSchema } from './utils/toNewPatient';
import { Patient, NewPatient } from './types';

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

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.send(diagnosisService.getDiagnoses());
});

app.get('/api/patients', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
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

app.use(errorMiddleWare);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
