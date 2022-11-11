<template>
  <main class="flex flex-row flex-wrap items-start justify-around p-4">
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
      <span v-if="formulaData.r2" class="block my-2">Titration formula:
        <span class="font-semibold italic">{{ formulaData.string }}</span>,
        R^2: <span class="font-semibold italic">{{ formulaData.r2 }}</span>
      </span>
      <LinesList :list="linesList" @deleteLine="deleteLine"/>
    </div>
    <div class="flex flex-col justify-between items-center w-full h-screen mt-4 md:mt-0 md:w-5/12 md:h-full">
      <div class="w-full">
        <LineChart
          :data="chartsData.mainChart.data"
          :options="chartsData.mainChart.options"
        />
        <LineChart
          v-if="selectedPreset !== 'default' && chartsData.additionalChart.data.datasets[0].data.length > 1"
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
  </main>
</template>

<script lang="ts" setup>
import { ComponentCustomProps, reactive, ref, watch } from 'vue';
import { jsPDF } from 'jspdf';
import { parser, getChartIndexByName, getRandomColor, formula, getSetValueByIndex } from '../utils';
import { DataPoint } from 'regression';
import { ScatterDataPoint, TooltipItem } from 'chart.js';

import Btn from './UI/Btn.vue';
import DefaultPreset from './PresetsForms/Default.vue';
import AbsPreset from './PresetsForms/Abs.vue';
import LineChart from './Charts/LineChart.vue';
import LinesList from './LinesList.vue';
import { computed } from 'vue';

const selectedPreset = ref<Preset>('default');
const presets: Record<Preset, ComponentCustomProps> = {
  default: DefaultPreset,
  abs: AbsPreset
};

const chartsData = reactive<ChartsData>({
  mainChart: {
    raw: new Set(),
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
            label: (context: TooltipItem<'line'>) => {
              return `${context.dataset.label?.split(' ')[0]}: ${context.parsed.x}, ${context.parsed.y}`;
            }
          }
        }
      }
    }
  },
  additionalChart: {
    raw: new Set(),
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
          type: 'linear',
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
          display: true,
        },
        tooltip: {
          usePointStyle: true,
          callbacks: {
            label: (context: TooltipItem<'line'>) =>
              `${context.chart.data.labels?.[context.dataIndex] || 'polynomial projection'}: ${context.parsed.x}, ${context.parsed.y}`,

          }
        }
      },
    },
  },
});

const formulaType = ref<FormulaType>('linear');
const linesList = ref<LinesListItem[]>([]);
const firstMax = computed(() => {
  try {
    return JSON.parse(getSetValueByIndex(chartsData.mainChart.raw, 0)).y.max;
  } catch {
    return 0;
  }
});

const formulaData = computed(() => {
  if(typeof chartsData.additionalChart.data.datasets[0].data[0] === 'object' ){
    const res = formula(formulaType.value, chartsData.additionalChart.data.datasets[0]);
    if(!chartsData.additionalChart.data.datasets[1]){
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      chartsData.additionalChart.data.datasets.push({
        label: 'Formula graph',
        data: res.points.map(([x,y]: DataPoint) => ({ x, y })),
        borderColor: 'red'
      });
    }
    return res;
  }
  return {
    string: '',
    points: [],
    r2: 0,
    predict: (x: number): DataPoint => [x,x],
  };
}, {
  onTrigger: () => 'polynomial',
});

const presetsExecuters: PresetsExecuters = {
  default: (_: ChartInfo, name: string) => {
    linesList.value.push({
      name,
    });
  },
  abs: (raw: Set<string>) => {
    chartsData.additionalChart.data.labels = [];
    chartsData.additionalChart.data.datasets[0].data = [];
    linesList.value = [];
    [...raw].forEach((rawData, index) => {
      const { name, thickness: b, coef: e, y, coefInputType: eInpType } = JSON.parse(rawData);
      const lineItem: LinesListItem = { name };
      const ratio = firstMax.value/y.max;
      const c = +(y.max / ((eInpType === 'default' ? e : 10**e)  * b)).toFixed(10);
      const prevMax = chartsData.additionalChart.options.scales!.x!.min;

      chartsData.additionalChart.options.scales!.x!.min = (prevMax && prevMax < c) ? prevMax : c;

      if(!index) {
        if(c) {
          chartsData.additionalChart.options.scales!.x!.title!.text = 'Concentration';
          chartsData.additionalChart.options.scales!.x!.type = 'linear';
          chartsData.additionalChart.options.scales!.x!.min = c;
        } else {
          chartsData.additionalChart.options.scales!.x!.type = 'category';
          chartsData.additionalChart.options.scales!.x!.title!.text = '';
        }

        chartsData.additionalChart.options.scales!.y!.title!.text = 'Ⅰ0/Ⅰi';
        chartsData.additionalChart.data.datasets[0].label = 'Titration';
      }

      if(c) {
        const dataPoint =  { x: c, y: ratio };
        lineItem.additional = {
          value: dataPoint,
          text: `C = ${c}`
        };

        chartsData.additionalChart.data.datasets[0].data = [...chartsData.additionalChart.data.datasets[0].data, dataPoint];

        if(chartsData.additionalChart.data.datasets[1]) {
          chartsData.additionalChart.data.datasets[1].data = [];
          chartsData.additionalChart.data.datasets[1].data.push(...(formulaData.value.points as unknown as number[]));
        }
      } else {
        chartsData.additionalChart.data.datasets[0].data = [...chartsData.additionalChart.data.datasets[0].data, ratio];
      }

      chartsData.additionalChart.data.labels = [...chartsData.additionalChart.data.labels, name];

      linesList.value.push(lineItem);
    });
  },
};

watch(chartsData.additionalChart.raw, () => {
  if(chartsData.additionalChart.preset) {
    presetsExecuters[chartsData.additionalChart.preset](
      [...chartsData.additionalChart.raw]
        .map((v) => JSON.parse(v))
        .sort((d, b) =>  d.y.max - b.y.max)
        .map((v) => JSON.stringify(v))
    );
  }
});

const parseFormData = (formData: ChartFormData) => {
  if(!formData.unparsedData.length) {
    return;
  }

  chartsData.additionalChart.preset = formData.preset;

  formData.unparsedData.forEach((unp: string) => {
    const parsedData = parser(unp);
    const name = `Ⅰ${chartsData.mainChart.data.datasets.length}`;

    chartsData.mainChart.options.scales!.x!.min = parsedData.x.min;
    chartsData.mainChart.raw.add(JSON.stringify(parsedData));
    chartsData.mainChart.data.datasets.push({
      data: parsedData.data,
      label: `${name} ${parsedData.y.max}`,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    });

    if(formData.preset !== 'default'){
      chartsData.additionalChart.raw.add(JSON.stringify({
        ...parsedData,
        ...formData.presetData,
        name,
      }));
      formulaType.value = formData.presetData.formulaType || 'linear';
    } else {
      presetsExecuters.default(parsedData, name);
    }
  });

  chartsData.mainChart.options.scales!.y!.title!.text = formData.yName;
};

const deleteLine = (name: string, itemInd: number) => {
  const item = linesList.value.splice(itemInd, 1)[0];
  const chartIndex = getChartIndexByName(chartsData.mainChart.data, name);
  chartsData.mainChart.data.datasets.splice(chartIndex, 1);

  if(chartsData.additionalChart.data.datasets[0].data.length){
    const additionalIndex = chartsData.additionalChart.data.datasets[0].data
      .findIndex((v: ScatterDataPoint | number) => {
        if(typeof v === 'object') {
          return v.x === item.additional?.value.x && v.y === item.additional?.value.y;
        }
      });
    chartsData.additionalChart.data.datasets[0].data = chartsData.additionalChart.data.datasets[0].data.filter((_, ind) => ind !== additionalIndex);
    if(chartsData.additionalChart.data.datasets[1]){
      chartsData.additionalChart.data.datasets[1].data = chartsData.additionalChart.data.datasets[1].data.filter((_, ind) => ind !== additionalIndex);
    }
    chartsData.additionalChart.data.labels = chartsData.additionalChart.data.labels?.filter((l) => l !== item.name);
    const firstItem = chartsData.additionalChart.data.datasets[0].data[0];
    chartsData.additionalChart.options.scales!.x!.min = typeof firstItem === 'object' ? firstItem.x : 0;
  }

  if(!linesList.value.length) {
    clear();
  }
};

const clear = () => {
  linesList.value = [];

  chartsData.mainChart.data.datasets = [];
  chartsData.mainChart.raw.clear();
  chartsData.mainChart.options.scales!.y!.title!.text = '';

  chartsData.additionalChart.raw.clear();
  chartsData.additionalChart.data.labels = [];
  chartsData.additionalChart.data.datasets = [{
    data: [],
    borderColor: getRandomColor()
  }];
};

const download = () => {
  const canvases = document.querySelectorAll('canvas');
  const canvasesImages: string[] = [];
  canvases.forEach((c) => {
    canvasesImages.push(c.toDataURL('image/jpeg', 1.0));
  });

  const pdf = new jsPDF('landscape');
  canvasesImages.forEach((cI: string, cInd: number) => {
    pdf.addImage(cI, 'JPEG', 5, 100*cInd, 170, 100);
  });
  pdf.save('AESanalyzer-charts.pdf');
};
</script>