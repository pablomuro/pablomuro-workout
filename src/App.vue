<template>
  <ReloadPrompt />
  <div class="flex flex-col border-2 m-4">
    <div class="flex justify-between border-2 mb-2 text-center">
      <span
        class="text-2xl font-bold p-4"
        @click.stop.capture="previousWorkout()"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </span>
      <h1 class="text-lg p-4">{{ workout.header }}</h1>
      <span class="text-2xl font-bold p-4" @click.stop.capture="nextWorkout()">
        <font-awesome-icon :icon="['fas', 'arrow-right']" />
      </span>
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
import ReloadPrompt from './components/ReloadPrompt.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowRight, faArrowLeft)

export default defineComponent({
  name: 'App',
  components: {
    List,
    CurrentWorkout,
    ReloadPrompt,
  },
  setup() {
    const dayOfWeek = new Date().getDay() - 1
    const workoutListLength = workoutList.length
    let workoutIndex = dayOfWeek % workoutListLength
    workoutIndex = workoutIndex >= 0 ? workoutIndex : 0

    const workout = ref<Workout>(workoutList[workoutIndex] as Workout)

    const nextWorkout = () => {
      workoutIndex =
        workoutIndex == workoutListLength - 1 ? 0 : workoutIndex + 1
      workout.value = workoutList[workoutIndex] as Workout
      updateWorkoutHeader()
      updateCurrentExercise()
    }

    const previousWorkout = () => {
      workoutIndex =
        workoutIndex == 0 ? workoutListLength - 1 : workoutIndex - 1
      workout.value = workoutList[workoutIndex] as Workout
      updateWorkoutHeader()
      updateCurrentExercise()
    }

    if (dayOfWeek % 2 == 0) {
      workout.value.exercises = (abdominal as any as Exercise[]).concat(
        workout.value.exercises
      )
      workout.value['muscule-group'].push('Abs')
    }
    const doneExerciseList = ref<Exercise[]>([])
    const currentExercise = ref<Exercise>({
      ...(workout.value.exercises.shift() as Exercise),
    })
    currentExercise.value.done = false

    const updateWorkoutHeader = () => {
      workout.value.header = `Workout ${
        workout.value.workout
      } -> ${workout.value['muscule-group'].join(' - ')}`
    }

    const updateCurrentExercise = () => {
      currentExercise.value = {
        ...(workout.value.exercises.shift() as Exercise),
      }
      currentExercise.value.done = false
    }

    updateWorkoutHeader()

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
      nextWorkout,
      previousWorkout,
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
