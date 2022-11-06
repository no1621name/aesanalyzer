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
      <SelectedInput
        first-type="default"
        second-type="logarithm"
        v-model="coefInputType"
      >
        <template #first>
          <input
            type="number"
            placeholder="Molar extinction coefficient [l/(mol*cm)]"
            :disabled="hasSent"
            v-model.number="coef"
            required
          >
        </template>
        <template #second>
          <input
            type="number"
            placeholder="log10 Molar extinction coefficient [l/(mol*cm)]"
            :disabled="hasSent"
            v-model.number="coef"
            required
          >
        </template>
      </SelectedInput>
      <input
        type="number"
        placeholder="Cuvette thickness [cm]"
        :disabled="hasSent"
        v-model.number="thickness"
        required
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