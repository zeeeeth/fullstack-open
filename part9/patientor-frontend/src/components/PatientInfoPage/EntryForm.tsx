import { HealthCheckRating } from '../../types';
import type { Diagnosis } from '../../types';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

interface EntryFormProps {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes: Array<string>;
  healthCheckRating: HealthCheckRating;
  type: 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare';
  employerName: string;
  startDate: string;
  endDate: string;
  dischargeDate: string;
  dischargeCriteria: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  setSpecialist: React.Dispatch<React.SetStateAction<string>>;
  setDiagnosisCodes: React.Dispatch<React.SetStateAction<Array<string>>>;
  setHealthCheckRating: React.Dispatch<React.SetStateAction<HealthCheckRating>>;
  setType: React.Dispatch<
    React.SetStateAction<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>
  >;
  setEmployerName: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  setDischargeDate: React.Dispatch<React.SetStateAction<string>>;
  setDischargeCriteria: React.Dispatch<React.SetStateAction<string>>;
  submit: (event: React.FormEvent) => void;
  diagnoses: Array<Diagnosis>;
}

const EntryForm = ({
  description,
  date,
  specialist,
  diagnosisCodes,
  healthCheckRating,
  type,
  employerName,
  startDate,
  endDate,
  dischargeDate,
  dischargeCriteria,
  setDescription,
  setDate,
  setSpecialist,
  setDiagnosisCodes,
  setHealthCheckRating,
  setType,
  setEmployerName,
  setStartDate,
  setEndDate,
  setDischargeDate,
  setDischargeCriteria,
  submit,
  diagnoses,
}: EntryFormProps) => {
  return (
    <div
      style={{
        border: '3px dotted black',
        padding: '10px',
        marginBottom: '10px',
      }}
    >
      <form onSubmit={submit}>
        <h3>Add New Entry</h3>
        <div>
          Type:
          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as
                  | 'HealthCheck'
                  | 'Hospital'
                  | 'OccupationalHealthcare'
              )
            }
          >
            <option value="HealthCheck">HealthCheck</option>
            <option value="Hospital">Hospital</option>
            <option value="OccupationalHealthcare">
              OccupationalHealthcare
            </option>
          </select>
        </div>
        <div>
          Description:{' '}
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          Date:{' '}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          Specialist:{' '}
          <input
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
          />
        </div>
        {type === 'Hospital' && (
          <div>
            Discharge Date:{' '}
            <input
              type="date"
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
            />
            <br />
            Discharge Criteria:{' '}
            <input
              value={dischargeCriteria}
              onChange={(e) => setDischargeCriteria(e.target.value)}
            />
          </div>
        )}
        {type === 'HealthCheck' && (
          <div>
            HealthCheck Rating:
            <select
              value={healthCheckRating}
              onChange={(e) =>
                setHealthCheckRating(
                  Number(e.target.value) as HealthCheckRating
                )
              }
            >
              {Object.keys(HealthCheckRating)
                .filter((k) => Number.isNaN(Number(k)))
                .map((k) => (
                  <option
                    key={k}
                    value={
                      HealthCheckRating[k as keyof typeof HealthCheckRating]
                    }
                  >
                    {k}
                  </option>
                ))}
            </select>
          </div>
        )}
        {type === 'OccupationalHealthcare' && (
          <div>
            Employer Name:{' '}
            <input
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
            />
            <br />
            Sick Leave Start Date:{' '}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <br />
            Sick Leave End Date:{' '}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}
        <div>
          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>

            <Select
              labelId="diagnosis-codes-label"
              multiple
              value={diagnosisCodes}
              onChange={(e: SelectChangeEvent<string[]>) => {
                const value = e.target.value;
                setDiagnosisCodes(
                  typeof value === 'string' ? value.split(',') : value
                );
              }}
              input={<OutlinedInput label="Diagnosis codes" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {diagnoses.map((d) => (
                <MenuItem key={d.code} value={d.code}>
                  <Checkbox checked={diagnosisCodes.indexOf(d.code) > -1} />
                  <ListItemText primary={`${d.code} ${d.name}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default EntryForm;
