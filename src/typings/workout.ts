export interface WorkoutJson {
  workout: string
  'muscule-group': string[]
  exercises: Exercise[]
  finisher?: string[]
}

export interface Workout extends WorkoutJson {
  header?: string // TS map, not JSON
}

export interface Exercise {
  exercise: string
  series: number
  reps: number | string
  done: boolean
  rest?: number
}

export interface JsonWorkoutType {
  restTime: number
  abdominal?: any[]
  workoutList: any
}
