<template>
  <div
    class="flex py-4 m-2 border-2 rounded-sm"
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
        class="self-center rounded border-gray-300 text-indigo-600 shadow-xs focus:border-indigo-300 focus:ring-3 focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
        :checked="exercise.done"
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
import { defineComponent, type PropType } from 'vue'
import type { Exercise } from '../typings/workout'

export default defineComponent({
  name: 'List',
  emits: ['done'],
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
  },
})
</script>
