<template>
  <button :class="['btn', classes[variant]]" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

const props = withDefaults(defineProps<{
  variant?: BtnVariant,
  type?: 'submit' | 'button',
  disabled?: boolean,
}>(), {
  variant: 'default',
  type: 'button',
  disabled: false
});

const { variant } = toRefs(props);

const classes: Record<BtnVariant, string> = {
  success: 'btn_success',
  danger: 'btn_danger',
  fullscreen: 'fullscreen__btn',
  default: ''
};
</script>