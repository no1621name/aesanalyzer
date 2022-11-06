<template>
   <div class="flex justify-between w-full items-center flex-wrap">
    <slot v-if="currType === firstType" name="first" />
    <slot v-else name="second" />

    <Btn
      class="h-min"
      @click="() => {
        currType = (currType === firstType ? secondType : firstType)
        $emit('update:modelValue', currType);
      }"
    >
      Change input type
    </Btn>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';

import Btn from './Btn.vue';

defineEmits(['update:modelValue']);
const props = defineProps<{
  firstType: string,
  secondType: string,
  modelValue: string,
}>();

const { firstType }  = toRefs(props);
const currType = ref(`${firstType.value}`);
</script>
