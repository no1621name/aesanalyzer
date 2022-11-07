<template>
  <div class="h-screen flex flex-row flex-wrap items-start justify-around p-4">
    <div class="w-full md:w-1/3">
      <h1 class="fs-">AESanalyzer</h1>
      <label for="selectChartFormPreset">
        Select chart preset:
        <select id="selectChartFormPreset" v-model="selectedPreset" @change="clear">
          <option value="abs">Absorbance/Emission</option>
          <option value="default" selected>Default</option>
        </select>
      </label>
      <component :is="presets[selectedPreset]" :disabled="!!linesList.length" @submit="parseFormData"/>
      <LinesList :list="linesList" @deleteLine="deleteLine"/>
    </div>
    <div class="flex flex-col justify-between items-center w-full h-screen mt-4 md:mt-0 md:w-5/12 md:h-full">
      <div class="w-full">
        <LineChart
          :data="chartsData.mainChart.data"
          :options="chartsData.mainChart.options"
        />
        <LineChart
          v-if="selectedPreset !== 'default' && chartsData.additionalChart.data.datasets[0].data.length"
          class="mt-3"
          :data="chartsData.additionalChart.data"
          :options="chartsData.additionalChart.options"
        />
        <Btn
          class="block mt-3 mx-auto"
          variant="success"
          :disabled="!chartsData.mainChart.data.datasets.length"
          @click="download"
        >
          Download chart as PDF
        </Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ComponentCustomProps, reactive, ref } from 'vue';
import { jsPDF } from 'jspdf';
import { parser, getChartIndexByName, getRandomColor } from '../utils';

import Btn from './UI/Btn.vue';
import DefaultPreset from './PresetsForms/Default.vue';
import AbsPreset from './PresetsForms/Abs.vue';
import LineChart from './Charts/LineChart.vue';
import LinesList from './LinesList.vue';

const selectedPreset = ref<Preset>('default');
const presets: Record<Preset, ComponentCustomProps> = {
  default: DefaultPreset,
  abs: AbsPreset
};

const chartsData = reactive<ChartsData>({
  mainChart: {
    data: {
      labels: [],
      datasets: []
    },
    options: {
      scales: {
        x: {
          min: 0,
          title: {
            text: 'Wavelength',
          }
        },
        y: {
          min: 0,
          title: {
            text: 'y',
          }
        }
      },
      plugins: {
        tooltip: {
          usePointStyle: true,
          callbacks: {
            label: (context: { dataset: { label: string }, parsed: { y: number, x: number } }) => {
              return `${context.dataset.label.split(' ')[0]}: ${context.parsed.x}, ${context.parsed.y}`;
            }
          }
        }
      }
    }
  },
  additionalChart: {
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          borderColor: getRandomColor()
        }
      ],
    },
    options: {
      pointRadius: 3,
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
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          usePointStyle: true,
          callbacks: {
            label: (context: { parsed: { y: number } }) => {
              return `${context.parsed.y}`;
            }
          }
        }
      },
    },
  },
});

const linesList = ref<LinesListItem[]>([]);
const firstMax = ref(0);

const presetsExecuters: PresetsExecuters = {
  default: (_: ChartInfo, name: string) => {
    linesList.value.push({
      name,
    });
  },
  abs: (info: ChartInfo, name: string, datasetIndex: number, e: number, eInpType: string, b: number) => {
    const lineItem: LinesListItem = { name };
    let xAxisName = '';

    if(e && b) {
      lineItem.additional = `C = ${+(info.y.max / ((eInpType === 'default' ? e : 10**e)  * b)).toFixed(10)}`;
      xAxisName = 'Concentration';
    }

    const ratio = firstMax.value/info.y.max;

    if(datasetIndex) {
      //chartjs bug
      chartsData.additionalChart.data.labels = [...(chartsData.additionalChart.data.labels || []), name];
      chartsData.additionalChart.data.datasets[0].data = [...chartsData.additionalChart.data.datasets[0].data, ratio];
    } else {
      // chartjs' types are a little um.. special~
      chartsData.additionalChart.options.scales!.x!.title!.text = xAxisName;
      chartsData.additionalChart.options.scales!.y!.title!.text = 'Ⅰ0/Ⅰi';
    }

    linesList.value.push(lineItem);
  },
};

const parseFormData = (formData: ChartFormData) => {
  if(!formData.unparsedData.length) {
    return;
  }

  formData.unparsedData.forEach((unp: string) => {
    const parsedData = parser(unp);
    const name = `Ⅰ${chartsData.mainChart.data.datasets.length}`;

    const datasetIndex = chartsData.mainChart.data.datasets.push({
      data: parsedData.data,
      label: `${name} ${parsedData.y.max}`,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }) - 1;

    if(!datasetIndex) {
      firstMax.value = parsedData.y.max;
    }

    chartsData.mainChart.options.scales!.x!.min = parsedData.x.min;

    presetsExecuters[formData.preset](parsedData, name, datasetIndex, ...Object.values(formData.presetData));
  });

  chartsData.mainChart.options.scales!.y!.title!.text = formData.yName;
};

const deleteLine = (name: string, itemInd: number) => {
  const chartIndex = getChartIndexByName(chartsData.mainChart.data, name);
  linesList.value.splice(itemInd, 1);
  chartsData.mainChart.data.datasets.splice(chartIndex, 1);

  if(chartsData.additionalChart.data.datasets[0].data.length){
    // chartjs bug
    chartsData.additionalChart.data.datasets[0].data = chartsData.additionalChart.data.datasets[0].data
      .filter((_: unknown, ind: number) => ind !== itemInd - 1);
    chartsData.additionalChart.data.labels = chartsData.additionalChart.data.labels?.filter((_, ind) => ind !== itemInd - 1);
  }
};

const clear = () => {
  chartsData.mainChart.data.datasets = [];
  chartsData.additionalChart.data.datasets = [{
    data: [],
    borderColor: getRandomColor()
  }];
  linesList.value = [];
  chartsData.mainChart.options.scales!.y!.title!.text = '';
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