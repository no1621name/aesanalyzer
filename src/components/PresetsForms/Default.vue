<template>
  <form
    class="flex flex-col items-start"
    @submit.prevent="submitForm"
  >
    <SelectedInput
      first-type="files"
      second-type="textarea"
      v-model="inputType"
    >
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
      :disabled="disabled"
      type="text"
      placeholder="Enter Y axis name"
      required
    >
    <InputGroup :values="substances" :disabled="disabled">Substances:</InputGroup>
    <slot />
    <Btn class="mt-1.5" type="submit">
      Submit
    </Btn>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import InputGroup from '../UI/InputGroup.vue';
import SelectedInput from '../UI/SelectedInput.vue';
import Btn from '../UI/Btn.vue';

const emit = defineEmits(['submit']);
withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false
});

const inputType = ref('');
const unparsedData = ref<string[]>([]);
const values = ref('');
const yName = ref('');
const substances = ref(['']);

const submitForm = () => {
  if(inputType.value === 'textarea') {
    unparsedData.value = [values.value];
  }
  emit('submit', {
    unparsedData,
    yName,
    inputType,
    preset: 'default',
    presetData: {},
    substances
  });
  values.value = '';
  unparsedData.value = [];
};

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
