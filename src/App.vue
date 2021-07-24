<template>
  <div class="flex flex-col border-2 m-4">
    <div class="border-2 p-4 mb-2 text-center">
      <h1 class="text-lg">{{ workout.header }}</h1>
    </div>
    <div v-for="exercise in workout.exercises" :key="exercise.exercise">
      <List :exercise="exercise" @done="workoutDone" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import List from './components/List.vue'

import workoutList from '../workout.json'
import { Exercise, Workout } from './typings/workout'

export default defineComponent({
  name: 'App',
  components: {
    List,
  },
  setup() {
    let workoutIndex = (new Date().getDay() - 1) % workoutList.length
    workoutIndex = workoutIndex >= 0 ? workoutIndex : 0

    const workout = ref<Workout>(workoutList[workoutIndex])

    workout.value.header = `Workout ${workout.value.workout} - ${workout.value[
      'muscule-group'
    ].join(' - ')}`

    const workoutDone = (exercise: Exercise): void => {
      const index = workout.value.exercises.indexOf(exercise)
      const workut = workout.value.exercises[index]
      workout.value.exercises.splice(index, 1)
      workout.value.exercises.push(workut)
    }

    return {
      workout,
      workoutDone,
    }
  },
})
</script>

<style scoped lang="post-css"></style>
