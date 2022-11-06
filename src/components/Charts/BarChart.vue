<template>
  <DefaultChart v-slot="slotProps">
    <Bar
      :chart-data="(slotProps.chartData as ChartData<'bar'>)"
      :chart-options="(slotProps.chartOptions as ChartOptions<'bar'>)"
      :chart-id="slotProps.chartId"
      :dataset-id-key="slotProps.datasetIdKey"/>
  </DefaultChart>
</template>

<script lang="ts" setup>
import DefaultChart from './DefaultChart.vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  BarElement,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  BarElement
);
</script>


<!-- <template>
  <div class="relative border border-black h-[400px]">
    <Btn
      @click="$event.target.parentElement.classList.toggle('fullscreen')"
      variant="fullscreen"
    >
      <img src="../assets/loupe-search.svg" alt="loupe-search">
    </Btn>
    <Bar
      v-if="data.datasets.length"
      :chart-options="config"
      :chart-data="data"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      class="h-[400px] p-2"
    />
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed } from 'vue';
import merge from 'ts-deepmerge';

import Btn from '../UI/Btn.vue';

import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ChartOptions,
  BarElement,
  ChartData
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = withDefaults(defineProps<{
  chartId?: string
  datasetIdKey?: string,
  width?: number
  height?: number,
  yName?: string,
  options?: ChartOptions<'bar'>,
  data: ChartData<'bar'>,
}>(), {
  chartId: 'line-chart',
  datasetIdKey: 'label',
  width: 400,
  height: 300,
  options: () => ({}),
});

const { yName, data, options } = toRefs(props);

const config = computed<ChartOptions<'bar'>>(() => {
  return merge<[ChartOptions<'bar'>, ChartOptions<'bar'>]>({
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 1
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Wavelength'
        },
        min: 0,
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: yName?.value || 'y'
        },
      }
    }
  }, options.value);
});
</script> -->