<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :width="width"
    :height="height"
  />
</template>

<!-- eslint-disable @typescript-eslint/no-empty-function -->
<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartOptions, ChartData } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

withDefaults(defineProps<{
  chartId?: string
  datasetIdKey?: string,
  width?: number
  height?: number,
  yName?: string,
  chartOptions: ChartOptions<'bar'>,
  chartData: ChartData<'bar'>,
}>(), {
  chartId: 'line-chart',
  datasetIdKey: 'label',
  width: 400,
  height: 300,
});
</script>