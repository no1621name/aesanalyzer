<template>
  <Btn @click="toggleTheme" class="text-sm">Toggle theme</Btn>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import Btn from './Btn.vue';

const toggleTheme = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('isDark', document.body.classList.contains('dark') ? 'true' : 'false');
};

onMounted(() =>{
  if(localStorage.getItem('isDark') === 'true') {
    document.body.classList.add('dark');
  }
});
</script>
