"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const diagnosisService_1 = __importDefault(require("./services/diagnosisService"));
const patientService_1 = __importDefault(require("./services/patientService"));
const toNewPatient_1 = __importDefault(require("./utils/toNewPatient"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 3001;
app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.get('/api/diagnoses', (_req, res) => {
    res.send(diagnosisService_1.default.getDiagnoses());
});
app.get('/api/patients', (_req, res) => {
    res.send(patientService_1.default.getNonSensitivePatients());
});
app.post('/api/patients', (req, res) => {
    try {
        const newPatient = (0, toNewPatient_1.default)(req.body);
        const addedPatient = patientService_1.default.addPatient(newPatient);
        res.json(addedPatient);
    }
    catch (error) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
