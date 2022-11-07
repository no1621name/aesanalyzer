<template>
  <DefaultChart v-slot="slotProps">
    <Line
      :chart-data="(slotProps.chartData as ChartData<'line'>)"
      :chart-options="(slotProps.chartOptions as ChartOptions<'line'>)"
      :chart-id="slotProps.chartId"
      :dataset-id-key="slotProps.datasetIdKey"
      :plugins="slotProps.plugins"
    />
  </DefaultChart>
</template>

<script lang="ts" setup>
import DefaultChart from './DefaultChart.vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement
);
</script>