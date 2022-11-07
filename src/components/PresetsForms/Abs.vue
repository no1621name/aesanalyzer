<template>
  <DefaultPreset
    @submit="(formData: ChartFormData) => {
      $emit('submit', merge(formData, {
        preset: 'abs',
        presetData: {
          coef,
          coefInputType,
          thickness
        }}));
      hasSent = true;
    }"
    :disabled="disabled"
  >
    <template #default>
      <!-- remove. build by I0/Ii -->
      <SelectedInput
        first-type="default"
        second-type="logarithm"
        v-model="coefInputType"
      >
        <template #first>
          <input
            v-model.number="coef"
            type="number"
            placeholder="Molar extinction coefficient [l/(mol*cm)]"
            :disabled="hasSent"
            min="0"
          >
        </template>
        <template #second>
          <input
            v-model.number="coef"
            type="number"
            placeholder="log10 Molar extinction coefficient [l/(mol*cm)]"
            :disabled="hasSent"
            min="0"
          >
        </template>
      </SelectedInput>
      <input
        v-model.number="thickness"
        type="number"
        placeholder="Cuvette thickness [cm]"
        :disabled="hasSent"
        min="0"
      >
    </template>
  </DefaultPreset>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import merge from 'ts-deepmerge';

import DefaultPreset from './Default.vue';
import SelectedInput from '../UI/SelectedInput.vue';

defineEmits(['submit']);
const props = withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false
});

const { disabled } = toRefs(props);

const coef = ref();
const thickness = ref();
const hasSent = ref(disabled);
const coefInputType = ref('default');
</script>

<style scoped>
input{
  width: 50%;
}
</style>