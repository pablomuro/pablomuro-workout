export interface Workout {
  workout: string;
  "muscule-group": string[];
  exercises: Exercise[];
  header?: string;
}

export interface Exercise {
  exercise: string;
  series: number;
  reps: number | string;
  done: boolean;
  rest?: number;
}

export interface JsonWorkoutType {
  restTime: number;
  abdominal?: any[];
  workoutList: any;
}
