<template>
  <div
    @click="markExercise"
    class="py-6 mx-2 my-6 border-2 rounded h-1/4"
    :class="[
      exercise.done
        ? 'bg-green-200'
        : 'active:bg-gray-300 active:ring-4 active:ring-offset-0 active:ring-opacity-50 active:ring-indigo-200',
    ]"
  >
    <transition :duration="{ enter: 500, leave: 800 }">
      <div class="flex">
        <div class="flex flex-col mx-4 self-center text-center">
          <h2>Done</h2>
          <h2>{{ seriesCount }}</h2>
        </div>
        <div class="flex flex-col ml-4">
          <h3>
            {{ exercise.exercise }}
          </h3>
          <span>
            {{ `${exercise.series} x ${exercise.reps}` }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, PropType } from 'vue'
import { Exercise } from '../typings/workout'

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
    const seriesCount = ref(0)

    const speakMessage = window.SpeechSynthesisUtterance
      ? new SpeechSynthesisUtterance()
      : null
    const markExercise = () => {
      let exercise = props.exercise
      if (!exercise.done) {
        if (seriesCount.value < exercise.series) seriesCount.value++
        speak(seriesCount.value.toString())

        if (seriesCount.value == exercise.series) {
          exercise.done = true

          const time = setTimeout(() => {
            speak('done')
            emit('done', exercise)
            seriesCount.value = 0
            clearTimeout(time)
          }, 500)
        }
      }
    }

    function speak(text: string) {
      if (speakMessage) {
        speakMessage.text = text.toString()
        speechSynthesis.speak(speakMessage)
      }
    }

    return {
      seriesCount,
      markExercise,
    }
  },
})
</script>

<style scoped lang="postcss"></style>
