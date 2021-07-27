<template>
  <div class="flex flex-col border-2 m-4">
    <div class="border-2 p-4 mb-2 text-center">
      <h1 class="text-lg">{{ workout.header }}</h1>
    </div>
    <div v-show="currentExercise.exercise">
      <h1>Current Exercise</h1>
      <CurrentWorkout :exercise="currentExercise" @done="workoutDone" />
    </div>
    <div v-show="workout.exercises.length">
      <h2>Next Exercise</h2>
      <transition-group name="list" tag="p">
        <div v-for="exercise in workout.exercises" :key="exercise.exercise">
          <List :exercise="exercise" />
        </div>
      </transition-group>
    </div>
    <div v-show="doneExerciseList.length">
      <h2>Done Exercises</h2>
      <transition-group name="list" tag="p">
        <div
          v-for="exerciseDone in doneExerciseList"
          :key="exerciseDone.exercise + 'Done'"
        >
          <List :exercise="exerciseDone" />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import List from './components/List.vue'

import { workoutList, abdominal } from '../workout.json'
import { Exercise, Workout } from './typings/workout'
import CurrentWorkout from './components/CurrentWorkout.vue'

export default defineComponent({
  name: 'App',
  components: {
    List,
    CurrentWorkout,
  },
  setup() {
    let workoutIndex = (new Date().getDay() - 1) % workoutList.length
    workoutIndex = workoutIndex >= 0 ? workoutIndex : 0

    const workout = ref<Workout>(workoutList[workoutIndex] as Workout)
    const doneExerciseList = ref<Exercise[]>([])
    const currentExercise = ref<Exercise>({
      ...(workout.value.exercises.shift() as Exercise),
    })
    currentExercise.value.done = false

    if (workoutIndex % 2 == 0) {
      workout.value.exercises = (abdominal as any as Exercise[]).concat(
        workout.value.exercises
      )
      workout.value['muscule-group'].push('Abs')
    }

    workout.value.header = `Workout ${workout.value.workout} -> ${workout.value[
      'muscule-group'
    ].join(' - ')}`

    const workoutDone = (exercise: Exercise): void => {
      const doneExercise = exercise

      currentExercise.value = {
        ...(workout.value.exercises.shift() as Exercise),
        done: false,
      }

      doneExerciseList.value.push(doneExercise)
    }

    return {
      workout,
      currentExercise,
      doneExerciseList,
      workoutDone,
    }
  },
})
</script>

<style scoped lang="postcss">
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
