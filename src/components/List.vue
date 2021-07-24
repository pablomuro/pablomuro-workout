<template>
  <div
    @click="markExercise"
    class="flex py-4 m-2 border-2 rounded"
    :class="[
      exercise.done
        ? 'bg-gray-300'
        : 'active:bg-gray-300 active:ring-4 active:ring-offset-0 active:ring-opacity-50 active:ring-indigo-200',
    ]"
  >
    <div class="ml-4 self-center">
      <input
        type="checkbox"
        ref="exerciseCheck"
        class="
          self-center
          rounded
          border-gray-300
          text-indigo-600
          shadow-sm
          focus:border-indigo-300
          focus:ring
          focus:ring-offset-0
          focus:ring-indigo-200
          focus:ring-opacity-50
        "
      />
    </div>
    <div class="flex flex-col ml-4">
      <h3 :class="[exercise.done ? 'line-through' : '']">
        {{ exercise.exercise }}
      </h3>
      <span :class="[exercise.done ? 'line-through' : '']">
        {{ `${exercise.series} x ${exercise.reps}` }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
interface Exercise {
  exercise: string
  series: number
  reps: number
  done: boolean
}
import { ref, defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'List',
  emits: ['done'],
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
  },
  setup: (props, { emit }) => {
    const exercise = ref<Exercise>(props.exercise)
    const exerciseCheck = ref<InstanceType<typeof HTMLInputElement>>()

    const markExercise = () => {
      if (!exercise.value.done) {
        if (exercise.value.series > 0)
          exercise.value.series = exercise.value.series - 1

        if (exercise.value.series == 0) {
          exerciseCheck.value ? (exerciseCheck.value.checked = true) : ''
          exercise.value.done = true
          emit('done', exercise.value)
        }
      }
    }

    return {
      exercise,
      markExercise,
      exerciseCheck,
    }
  },
})
</script>

<style scoped lang="postcss"></style>
