"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const parseString = (value) => {
    if (!value || !isString(value)) {
        throw new Error('Incorrect or missing string');
    }
    return value;
};
const isGender = (param) => {
    return Object.values(types_1.Gender)
        .map((g) => g.toString())
        .includes(param);
};
const parseGender = (value) => {
    if (!value || !isString(value) || !isGender(value)) {
        throw new Error('Incorrect or missing gender');
    }
    return value;
};
const toNewPatient = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('name' in object &&
        'dateOfBirth' in object &&
        'ssn' in object &&
        'gender' in object &&
        'occupation' in object) {
        const newPatient = {
            name: parseString(object.name),
            dateOfBirth: parseString(object.dateOfBirth),
            ssn: parseString(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseString(object.occupation),
        };
        return newPatient;
    }
    throw new Error('Incorrect data: some fields are missing');
};
exports.default = toNewPatient;
