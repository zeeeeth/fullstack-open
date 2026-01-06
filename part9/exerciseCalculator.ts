type Result = {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingExplanation: string;
  target: number;
  average: number;
};

interface ExerciseValues {
  dailyExercises: number[];
  target: number;
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const target = Number(args[2]);
  const dailyExercises: number[] = [];
  for (let i = 3; i < args.length; i++) {
    const hours = Number(args[i]);
    if (isNaN(hours)) {
      throw new Error('Provided values were not numbers!');
    } else {
      dailyExercises.push(hours);
    }
  }
  return {
    dailyExercises,
    target,
  };
};

const calculateExercises = (
  dailyExercises: number[],
  target: number
): Result => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter((day) => day > 0).length;
  const totalHours = dailyExercises.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;
  let rating: number;
  let ratingExplanation: string;

  if (average < target * 0.5) {
    rating = 1;
    ratingExplanation = 'You need to work harder';
  } else if (average < target) {
    rating = 2;
    ratingExplanation = 'Not too bad but could be better';
  } else {
    rating = 3;
    ratingExplanation = 'Great job, you met your target!';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingExplanation,
    target,
    average,
  };
};

try {
  const { dailyExercises, target } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(dailyExercises, target));
} catch (error) {
  if (error instanceof Error) {
    console.log('Error:', error.message);
  }
}
