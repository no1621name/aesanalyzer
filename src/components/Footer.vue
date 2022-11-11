<template>
  <footer class="p-2">
    <Btn @click="toggleTheme">Toggle theme</Btn>
  </footer>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import Btn from './UI/Btn.vue';

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
