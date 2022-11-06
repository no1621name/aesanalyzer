<template>
  <div class="relative border border-black h-[400px] default-chart">
    <Btn
      @click="$event.target.parentElement.classList.toggle('fullscreen')"
      variant="fullscreen"
    >
      <img src="../../assets/loupe-search.svg" alt="loupe-search">
    </Btn>
    <slot
      v-if="data && data?.datasets.length"
      :chart-options="config"
      :chart-data="data"
      :chart-id="chartId"
      :plugins="[bgColor]"
      :dataset-id-key="datasetIdKey"
    />
  </div>
</template>

<script lang="ts" setup>
import Btn from '../UI/Btn.vue';

import merge from 'ts-deepmerge';
import { toRefs, computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ChartOptions,
  ChartData
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
);

const props = withDefaults(defineProps<{
  chartId?: string
  datasetIdKey?: string,
  width?: number
  height?: number,
  yName?: string,
  options?: ChartOptions,
  data?: ChartData,
}>(), {
  chartId: 'line-chart',
  datasetIdKey: 'label',
  width: 400,
  height: 300,
  options: () => ({}),
});

const bgColor = {
  id: 'bgColor',
  beforeDraw: (chart: any, _: unknown, options: { backgroundColor: string }) => {
    const { ctx, width, height } = chart;
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
};

const { yName, options, data } = toRefs(props);

const config = computed<ChartOptions>(() => {
  return merge<[ChartOptions, ChartOptions]>({
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bgColor: {
        backgroundColor: 'white',
      }
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
</script>

<style>
.default-chart > div {
  height: 100% !important;
}
</style>