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

<!-- <template>
  <div class="relative border border-black h-[400px]">
    <Btn
      @click="$event.target.parentElement.classList.toggle('fullscreen')"
      variant="fullscreen"
    >
      <img src="../assets/loupe-search.svg" alt="loupe-search">
    </Btn>
    <Line
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


import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ChartOptions,
  LineElement,
  PointElement,
  ChartData
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const props = withDefaults(defineProps<{
  chartId?: string
  datasetIdKey?: string,
  width?: number
  height?: number,
  yName?: string,
  options?: ChartOptions<'line'>,
  data: ChartData<'line'>,
}>(), {
  chartId: 'line-chart',
  datasetIdKey: 'label',
  width: 400,
  height: 300,
  options: () => ({}),
});

const { yName, data, options } = toRefs(props);

const config = computed<ChartOptions<'line'>>(() => {
  return merge<[ChartOptions<'line'>, ChartOptions<'line'>]>({
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