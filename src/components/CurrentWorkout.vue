<template>
  <transition :duration="{ enter: 500, leave: 800 }">
    <div class="border-2 rounded mx-2 py-6 my-6 h-1/4">
      <div
        @click="markExercise"
        class="flex flex-col py-6 my-6 h-1/4"
        :class="[exercise.done ? 'bg-green-200' : btnActiveClass]"
      >
        <div class="flex flex-col text-center mb-3">
          <h3>
            {{ exercise.exercise }}
          </h3>
          <span>
            {{ `${exercise.series} x ${exercise.reps}` }}
          </span>
        </div>
        <div class="flex">
          <div class="flex flex-col self-center text-center w-1/2">
            <h2 class="mb-3">Done</h2>
            <h2 class="text-2xl font-bold">{{ seriesCount }}</h2>
          </div>
          <div class="flex flex-col self-center text-center w-1/2">
            <h2 class="mb-3">Rest</h2>
            <div class="flex text-center self-center">
              <h1 class="text-2xl font-bold self-center">
                {{ `${minutes}:${seconds}` }}
              </h1>
              <div class="ml-5">
                <div
                  class="border rounded px-6 py-3 mb-1"
                  @click.stop.capture="manageRest('plus', $event)"
                  :class="[btnActiveClass]"
                >
                  <h1 class="text-2xl font-bold">
                    <font-awesome-icon :icon="['fas', 'plus']" />
                  </h1>
                </div>
                <div
                  class="border rounded px-6 py-3 mt-1"
                  @click.stop.capture="manageRest('minus', $event)"
                  :class="[btnActiveClass]"
                >
                  <h1 class="text-2xl font-bold">
                    <font-awesome-icon :icon="['fas', 'minus']" />
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-around mt-5">
        <div
          class="border-2 rounded w-2/4 py-5 mx-1 text-center"
          @click.stop.capture="manageSeriesCount('undo', $event)"
          :class="[btnActiveClass]"
        >
          <font-awesome-icon :icon="['fas', 'undo-alt']" size="lg" />
        </div>
        <div
          class="border-2 rounded w-2/4 py-5 mx-1 text-center"
          @click.stop.capture="manageSeriesCount('redo', $event)"
          :class="[btnActiveClass]"
        >
          <font-awesome-icon :icon="['fas', 'redo-alt']" size="lg" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { ref, defineComponent, PropType, watch } from 'vue'
import { restTime } from '../../workout.json'
import { Exercise } from '../typings/workout'
import { SpeechSynthesisUtteranceFactory } from '../utils/SpeechSynthesisUtteranceFactory'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUndoAlt,
  faRedoAlt,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons'

library.add(faUndoAlt, faRedoAlt, faPlus, faMinus)

export default defineComponent({
  name: 'CurrentWorkout',
  emits: ['done'],
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
  },
  setup: (props, { emit }) => {
    const exercise = props.exercise
    const seriesCount = ref(0)
    let exerciseRestTime = exercise.rest
      ? exercise.rest * 1000
      : restTime * 1000

    let nextTimeRest = exerciseRestTime
    const minutes = ref('00')
    const seconds = ref('00')
    setTimerDisplay()

    let timer: any = null
    let timerRunning = false

    const speakMessage = window.SpeechSynthesisUtterance
      ? SpeechSynthesisUtteranceFactory.new()
      : null

    const btnActiveClass =
      'active:bg-gray-300 active:ring-4 active:ring-offset-0 active:ring-opacity-50 active:ring-indigo-200'
    watch(
      () => props.exercise,
      (exercise) => {
        exerciseRestTime = exercise.rest
          ? exercise.rest * 1000
          : restTime * 1000
        setTimerDisplay()
      }
    )
    const markExercise = () => {
      let exercise = props.exercise
      if (timerRunning) {
        clearTimer()
      }
      if (!exercise.done) {
        if (seriesCount.value < exercise.series) seriesCount.value++
        speak(`${seriesCount.value} done`)

        if (seriesCount.value == exercise.series) {
          exercise.done = true

          const time = setTimeout(() => {
            speak('next exercise')
            emit('done', exercise)
            seriesCount.value = 0
            clearTimeout(time)
          }, 500)
        } else {
          startRest()
        }
      }
    }

    const manageRest = (actionType: string, event: Event) => {
      event.stopImmediatePropagation()

      nextTimeRest +=
        actionType === 'plus' ? exerciseRestTime : -1 * exerciseRestTime

      nextTimeRest =
        nextTimeRest < exerciseRestTime ? exerciseRestTime : nextTimeRest

      if (!timerRunning) setTimerDisplay(nextTimeRest)

      if (actionType === 'plus') speak('rest added')
    }

    const manageSeriesCount = (actionType: string, event: Event) => {
      event.stopImmediatePropagation()

      let exercise = props.exercise
      if (!exercise.done) {
        if (actionType === 'undo' && seriesCount.value > 0) {
          seriesCount.value--
        } else if (
          actionType === 'redo' &&
          seriesCount.value < exercise.series
        ) {
          seriesCount.value++
        }
      }
    }

    const startRest = () => {
      nextTimeRest =
        nextTimeRest == exerciseRestTime
          ? Date.now() + exerciseRestTime
          : Date.now() + nextTimeRest

      timerRunning = true
      const counterStrings = [...[5, 4, 3, 2, 1, 'go']]

      timer = setInterval(() => {
        const distance = nextTimeRest - Date.now()

        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        if (seconds <= 5 && seconds >= 0) {
          speak(counterStrings.shift()?.toString())
        }

        if (distance < 0) {
          clearTimer()
          return
        }

        setTimerDisplay(distance)
      }, 1000)
    }

    function clearTimer() {
      clearInterval(timer)
      nextTimeRest = exerciseRestTime
      timerRunning = false
      setTimerDisplay()
    }

    function setTimerDisplay(time: number = exerciseRestTime) {
      const _minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
      const _seconds = Math.floor((time % (1000 * 60)) / 1000)

      minutes.value = _minutes < 10 ? `0${_minutes}` : _minutes.toString()
      seconds.value = _seconds < 10 ? `0${_seconds}` : _seconds.toString()
    }

    function speak(text: string | undefined) {
      if (speakMessage && text) {
        speakMessage.text = text.toString()
        speechSynthesis.speak(speakMessage)
      }
    }

    return {
      seriesCount,
      markExercise,
      minutes,
      seconds,
      manageRest,
      manageSeriesCount,
      btnActiveClass,
    }
  },
})
</script>

<style scoped lang="postcss"></style>
