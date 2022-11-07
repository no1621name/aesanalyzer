<template>
  <form
    class="flex flex-col items-start"
    @submit.prevent="() => {
      if(inputType === 'textarea') {
        unparsedData = [values];
      }
      $emit('submit', {
        unparsedData,
        yName,
        inputType,
        preset: 'default',
        presetData: {},
        substances
      });
      values = '';
      hasSent = true;
      unparsedData = [];
    }"
  >

    <SelectedInput first-type="files" second-type="textarea" v-model="inputType">
      <template #first>
        <input
          type="file"
          name="chartFiles"
          accept=".txt"
          id="chartFiles"
          multiple required
          @change="handleFiles"
        >
      </template>
      <template #second>
        <div  class="flex justify-between w-7/12">
          <textarea :placeholder="`Values: \n154.0000 0.305061`" required v-model="values"></textarea>
        </div>
      </template>
    </SelectedInput>
    <input
      v-model="yName"
      :disabled="hasSent"
      type="text"
      placeholder="Enter Y axis name"
      required
    >
    <InputGroup :values="substances" :disabled="hasSent">Substances:</InputGroup>
    <slot />
    <Btn class="mt-1.5" type="submit">
      Submit
    </Btn>
  </form>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';

import InputGroup from '../UI/InputGroup.vue';
import SelectedInput from '../UI/SelectedInput.vue';
import Btn from '../UI/Btn.vue';

defineEmits(['submit']);
const props = withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false
});

const { disabled } = toRefs(props);

const inputType = ref('');
const unparsedData = ref<string[]>([]);
const values = ref('');
const yName = ref('');
const hasSent = ref(disabled.value);
const substances = ref(['']);

const handleFiles = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;

  if (!target || !files) { return; }

  Object.keys(files).forEach((index) => {
    const file = files[+index];
    if (!file.type.includes('text')) { return; }

    const reader = new FileReader();
    reader.addEventListener('loadend', (e: ProgressEvent<FileReader>) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        unparsedData.value.push(e.target.result);
      }
    });

    reader.readAsText(file);
  });
};
</script>
