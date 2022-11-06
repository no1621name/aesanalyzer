<template>
  <div class="h-screen flex flex-row flex-wrap items-start justify-around p-4">
    <div class="w-full md:w-1/3">
      <label for="selectChartFormPreset">
        Select chart preset:
        <select id="selectChartFormPreset" v-model="selectedPreset" @change="clear">
          <option value="abs">Absorbance</option>
          <option value="default" selected>Default</option>
        </select>
      </label>
      <component :is="presets[selectedPreset]" :disabled="!!linesList.length" @submit="parseFormData"/>
      <LinesList :list="linesList" @deleteLine="deleteLine"/>
    </div>
    <div class="flex flex-col justify-between items-center w-full h-screen mt-4 md:mt-0 md:w-5/12 md:h-full">
      <div class="w-full">
        <LineChart
          :data="mainChartData"
          :y-name="mainChartYName"
          :options="mainChartOptions"
        />
        <LineChart
          v-if="selectedPreset !==  'default' && additionalChartData.datasets[0].data.length"
          class="mt-3"
          :data="additionalChartData"
          :y-name="additionalChartYName"
          :options="additionalChartOptions"
        />
        <Btn
          class="block mt-3 mx-auto"
          variant="success"
          :disabled="!mainChartData.datasets.length"
          @click="download"
        >Download chart as PDF</Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ChartData } from 'chart.js';
import parser from '../utils/parser';
import getChartIndexByName from '../utils/getChartIndexByName';
import { jsPDF } from 'jspdf';

import Btn from './UI/Btn.vue';
import DefaultPreset from './PresetsForms/Default.vue';
import AbsPreset from './PresetsForms/Abs.vue';
import LineChart from './Charts/LineChart.vue';
import LinesList from './LinesList.vue';

const selectedPreset = ref<Preset>('default');
const presets: Record<Preset, any> = {
  default: DefaultPreset,
  abs: AbsPreset
};

const mainChartData = ref<ChartData<'line'>>({
  datasets: []
});
const mainChartOptions = ref({
  scales: { x: { min: 0 }, y: { min: 0 } }
});
const linesList = ref<LinesListItem[]>([]);
const mainChartYName = ref('');
const firstMax = ref(0);

const additionalChartData = ref<ChartData<'line'>>({
  labels: [],
  datasets: [{
    data: [],
    borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }],
});
const additionalChartOptions = ref({
  scales: {
    x: {
      type: 'category',
      title: {
        text: ''
      }
    },
    y: {
      min: 0,
      title: {
        text: 'y',
      },
    }
  },
  pointRadius: 3,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      usePointStyle: true,
      callbacks: {
        label: function(context: any) {
          return `${context.parsed.y}`;
        }
      }
    }
  },
});
const additionalChartYName = ref('');

const presetsExecuters: PresetsExecuters = {
  default: () => ({
    val: 0,
    text: ''
  }),
  abs: (info: ChartInfo, name: string, datasetIndex: number, e: number, eInpType: string, b: number) => {
    const conc =  +(info.y.max / ((eInpType === 'default' ? e : 10**e)  * b)).toFixed(10);
    const ratio = firstMax.value/info.y.max;

    if(datasetIndex) {
      //chartjs bug
      additionalChartData.value.labels = [...(additionalChartData.value.labels || []), name];
      additionalChartData.value.datasets[0].data = [...additionalChartData.value.datasets[0].data, ratio];
    } else {
      additionalChartOptions.value.scales.y.title.text = 'Ⅰ0/Ⅰi';
      additionalChartOptions.value.scales.x.title.text = 'Concentration';
    }

    return {
      val: conc,
      text: `C = ${conc}`
    };
  },
};

const parseFormData = (formData: ChartFormData) => {
  if(!formData.unparsedData.length) {
    return;
  }

  formData.unparsedData.forEach((unp: string) => {
    const parsedData = parser(unp);
    const name = `Ⅰ${mainChartData.value.datasets.length}`;

    const datasetIndex = mainChartData.value.datasets.push({
      data: parsedData.data,
      label: `${name} ${parsedData.y.max}`,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }) - 1;

    if(!datasetIndex) {
      firstMax.value = parsedData.y.max;
    }

    mainChartOptions.value.scales.x.min = parsedData.x.min;

    const additional = presetsExecuters[formData.preset](parsedData, name, datasetIndex, ...Object.values(formData.presetData));
    linesList.value.push({
      name,
      additional: additional.text,
    });
  });

  mainChartYName.value = formData.yName;
};

const deleteLine = (name: string, itemInd: number) => {
  const chartIndex = getChartIndexByName(mainChartData.value, name);
  linesList.value.splice(itemInd, 1);
  mainChartData.value.datasets.splice(chartIndex, 1);

  if(additionalChartData.value.datasets[0].data.length){
    // chartjs bug
    additionalChartData.value.datasets[0].data = additionalChartData.value.datasets[0].data.filter((_, ind) => ind !== itemInd - 1);
    additionalChartData.value.labels = additionalChartData.value.labels?.filter((_, ind) => ind !== itemInd - 1);
  }
};

const clear = () => {
  mainChartData.value.datasets = [];
  mainChartOptions.value = {  scales: { x: { min: 0 }, y: { min: 0 } } };
  linesList.value = [];
  mainChartYName.value = '';
};


const download = () => {
  const canvases = document.querySelectorAll('canvas');
  const canvasesImages: string[] = [];
  canvases.forEach((c) => {
    canvasesImages.push(c.toDataURL('image/jpeg', 1.0));
  });
  const pdf = new jsPDF('landscape');
  canvasesImages.forEach((cI: string, cInd: number) => {
    pdf.addImage(cI, 'JPEG', 5, 100*cInd, 150, 100);
  });
  pdf.save('charts.pdf');
};
</script>