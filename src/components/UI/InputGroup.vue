<template>
  <div class="flex flex-col w-1/3">
    <slot />
    <label
      v-for="(_, ind) in inputs"
      :key="ind"
      class="flex justify-between w-full items-center"
    >
      <input class="w-10/12" type="text" v-model="inputs[ind]" required :disabled="disabled">
      <Btn
        v-if="ind > 0"
        variant="danger"
        class="h-min py-1"
        :disabled="disabled"
        @click="() => inputs.splice(ind, 1)"
      >X</Btn>
    </label>
    <Btn class="w-full" @click="() => inputs.push('')" :disabled="disabled">+</Btn>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref } from 'vue';
import Btn from './Btn.vue';

const props = withDefaults(defineProps<{
  disabled?: boolean,
  values: string[],
}>(), { disabled: false });

const {values} = toRefs(props);

const inputs = ref(values);
</script>
