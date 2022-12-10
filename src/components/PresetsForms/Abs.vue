<template>
  <DefaultPreset
    @submit="submitForm"
    :disabled="disabled"
  >
    <template #default>
      <SelectedInput
        first-type="default"
        second-type="logarithm"
        v-model="coefInputType"
        @update:model-value="coef = undefined"
      >
        <template #first>
          <input
            v-model.number="coef"
            type="number"
            placeholder="Molar extinction coefficient [l/(mol*cm)]"
            :disabled="disabled"
            min="0"
            step="0.00001"
          >
        </template>
        <template #second>
          <input
            v-model.number="coef"
            type="number"
            placeholder="log10 Molar extinction coefficient [l/(mol*cm)]"
            :disabled="disabled"
            min="0"
            step="0.00001"
          >
        </template>
      </SelectedInput>
      <input
        v-model.number="thickness"
        type="number"
        placeholder="Cuvette thickness [cm]"
        :disabled="disabled"
        min="0"
      >
      <label for="selectFormulaType">
        Formla type:
        <select id="selectFormulaType" v-model="formulaType" :disabled="disabled">
          <option value="linear" selected>Linear</option>
          <option value="polynomial">Polynomial</option>
        </select>
      </label>
    </template>
  </DefaultPreset>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import merge from 'ts-deepmerge';

import DefaultPreset from './Default.vue';
import SelectedInput from '../UI/SelectedInput.vue';

const emit = defineEmits(['submit']);
withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false
});

const coef = ref();
const thickness = ref();
const coefInputType = ref('default');
const formulaType = ref<FormulaType>('linear');

const submitForm = (formData: ChartFormData) => {
  emit('submit', merge(formData, {
    preset: 'abs',
    presetData: {
      coef,
      coefInputType,
      thickness,
      formulaType
    }}));
};
</script>

<style scoped>
input{
  width: 50%;
}
</style>