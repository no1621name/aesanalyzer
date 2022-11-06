<template>
  <div class="flex flex-row flex-wrap justify-around">
    <div
      v-for="(line, index) in list"
      :key="index"
      class="flex flex-col mt-3 items-center border rounded border-gray-500 bg-gray-300 p-2"
    >
      <h3>{{line.name}}</h3>
      <p v-if="line.additional">
        {{line.additional}}
      </p>
      <button
        class="mt-2 btn btn_danger chart-delete__btn"
        @click="$emit('deleteLine', line.name, index)"
      >
        Delete chart
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  list: Array<LinesListItem>
}>();

defineEmits(['deleteLine']);
</script>
