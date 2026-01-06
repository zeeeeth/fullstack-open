import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { weight, height } = req.query;
  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (isNaN(heightNum) || isNaN(weightNum)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
  return res.status(200).json({
    weight,
    height,
    bmi: calculateBmi(heightNum, weightNum),
  });
});

type ExerciseBody = {
  daily_exercises: unknown;
  target: unknown;
};

const isNumberArray = (x: unknown): x is number[] =>
  Array.isArray(x) && x.every((n) => typeof n === 'number' && !Number.isNaN(n));

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body as ExerciseBody;

  if (daily_exercises === undefined || target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (
    !isNumberArray(daily_exercises) ||
    typeof target !== 'number' ||
    Number.isNaN(target)
  ) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  return res.json(calculateExercises(daily_exercises, target));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
