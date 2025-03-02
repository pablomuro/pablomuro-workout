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
    <div class="border-2 mx-2 py-2 text-center"
      @click.stop.capture="() => absRef.isAbsDay  = !absRef.isAbsDay "
      :class="[absRef.isAbsDay ? 'bg-green-200' : '']"
    >
      <h2>{{absRef.text}}</h2>
    </div>
    <div v-show="currentExercise?.exercise">
      <CurrentWorkout :exercise="currentExercise" @done="workoutDone" />
    </div>
    <div v-show="workout.exercises.length">
      <h2>Next Exercise</h2>
      <transition-group name="list" tag="p">
        <div v-for="exercise in exerciseList" :key="exercise.exercise">
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
import { defineComponent, ref, watch } from 'vue'
import List from './components/List.vue'

import { workoutList, abdominal } from '../workout.json'
import { Exercise, Workout } from './typings/workout'
import CurrentWorkout from './components/CurrentWorkout.vue'
import ReloadPrompt from './components/ReloadPrompt.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowRight, faArrowLeft)

const WITH_ABS="with abs series"
const WITHOUT_ABS="without abs series"


export default defineComponent({
  name: 'App',
  components: {
    List,
    CurrentWorkout,
    ReloadPrompt,
  },
  setup() {
    const dayOfWeek = new Date().getDay() - 1
    const isAbsDay = dayOfWeek % 2 == 0 

    const absRef = ref({
      isAbsDay: isAbsDay,
      text: isAbsDay ? WITH_ABS : WITHOUT_ABS
    })

    // const toggleAbs = ref(isAbsDay ? true: false)
    // const absText = ref(isAbsDay ? WITH_ABS : WITHOUT_ABS)

    watch(absRef.value, () => {
      absRef.value.text  = absRef.value.isAbsDay ? WITH_ABS : WITHOUT_ABS
      updateExercises()
    })


    
    const workoutListLength = workoutList.length
    let workoutIndex = dayOfWeek % workoutListLength
    workoutIndex = workoutIndex >= 0 ? workoutIndex : 0

    const workout = ref<Workout>(workoutList[workoutIndex] as Workout)

    const exerciseList = ref<Exercise[]>([])
    const doneExerciseList = ref<Exercise[]>([])

    exerciseList.value = [...workout.value.exercises]

    const currentExercise = ref<Exercise>({
      ...(exerciseList.value.shift() as Exercise),
    })
    currentExercise.value.done = false

    const nextWorkout = () => {
      workoutIndex =
        workoutIndex == workoutListLength - 1 ? 0 : workoutIndex + 1
      workout.value = workoutList[workoutIndex] as Workout
      updateExercises()
    }

    const previousWorkout = () => {
      workoutIndex =
        workoutIndex == 0 ? workoutListLength - 1 : workoutIndex - 1
      workout.value = workoutList[workoutIndex] as Workout
      updateExercises()
    }

    const updateExercises = () => {
      console.log('updateExercises')
      updateWorkoutHeader()
      exerciseList.value = [...workout.value.exercises]
      doneExerciseList.value = []
      if (absRef.value.isAbsDay == true) {
        // TODO - add on the beginning of the list
        // exerciseList.value = (abdominal as Exercise[]).concat(
        //   exerciseList.value
        // )

       exerciseList.value  = exerciseList.value.concat(abdominal as Exercise[])

        if(!workout.value['muscule-group'].includes('Abs'))
          workout.value['muscule-group'].push('Abs')
      }
      currentExercise.value = {
        ...(exerciseList.value.shift() as Exercise),
      }
      currentExercise.value.done = false
    }

    const updateWorkoutHeader = () => {
      workout.value.header = `Workout ${
        workout.value.workout
      } -> ${workout.value['muscule-group'].join(' - ')}`
    }

    updateExercises()

    const workoutDone = (exercise: Exercise): void => {
      const doneExercise = exercise

      currentExercise.value = {
        ...(exerciseList.value.shift() as Exercise),
        done: false,
      }

      doneExerciseList.value.push(doneExercise)
    }

    return {
      workout,
      nextWorkout,
      previousWorkout,
      currentExercise,
      exerciseList,
      doneExerciseList,
      workoutDone,
      // toggleAbs,
      // absText
      absRef
    }
  },
})
</script>

<style scoped>
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
