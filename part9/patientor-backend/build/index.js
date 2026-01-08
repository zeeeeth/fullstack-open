"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const diagnosisService_1 = __importDefault(require("./services/diagnosisService"));
const patientService_1 = __importDefault(require("./services/patientService"));
const zod_1 = require("zod");
const toNewPatient_1 = require("./utils/toNewPatient");
const toNewEntry_1 = require("./utils/toNewEntry");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 3001;
const errorMiddleWare = (error, _req, res, next) => {
    if (error instanceof zod_1.z.ZodError) {
        res.status(400).send({ error: error.issues });
    }
    else {
        next(error);
    }
};
app.get('/api/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.get('/api/diagnoses', (_req, res) => {
    res.send(diagnosisService_1.default.getDiagnoses());
});
app.get('/api/patients', (_req, res) => {
    res.send(patientService_1.default.getNonSensitivePatients());
});
app.get('/api/patients/:id', (req, res) => {
    res.send(patientService_1.default.getPatientById(req.params.id));
});
const newPatientParser = (req, _res, next) => {
    try {
        toNewPatient_1.NewPatientSchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
app.post('/api/patients', newPatientParser, (req, res) => {
    const addedPatient = patientService_1.default.addPatient(req.body);
    res.json(addedPatient);
});
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        return [];
    }
    return object.diagnosisCodes;
};
const newEntryParser = (req, _res, next) => {
    if (!req.body || typeof req.body !== 'object' || !('type' in req.body)) {
        next(new Error('Entry type is missing'));
        return;
    }
    try {
        const diagnosisCodes = parseDiagnosisCodes(req.body);
        const bodyWithDiagnoses = Object.assign(Object.assign({}, req.body), { diagnosisCodes });
        toNewEntry_1.NewEntrySchema.parse(bodyWithDiagnoses);
        next();
    }
    catch (error) {
        next(error);
    }
};
app.post('/api/patients/:id/entries', newEntryParser, (req, res) => {
    try {
        const addedEntry = patientService_1.default.addEntry(req.params.id, req.body);
        res.json(addedEntry);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        res.status(400).send({ error: message });
    }
});
app.use(errorMiddleWare);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
