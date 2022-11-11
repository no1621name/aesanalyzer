/* eslint-disable */
/// <reference types="vite/client" />
import { ChartDataset, ChartOptions, Chart, ScatterDataPoint } from 'chart.js';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  type BtnVariant = 'success' | 'danger' | 'fullscreen' | 'default';
  type InputType = 'files' | 'textarea';
  type FormulaType = 'linear' | 'polynomial';

  type Preset = 'default' | 'abs';
  type PresetsTemplates = Record<Preset, string>;
  // type PresetsExecuters = Record<Preset, (info: ChartInfo, name: string, datasetIndex: number, ...arg) => void>;
  type PresetsExecuters = Record<Preset, any>;

  type ChartsData = Record<string, {
    data: {
      labels: Array<string>;
      datasets: Array<ChartDataset<'line', (ScatterDataPoint | number)[]>>
    };
    options: ChartOptions<'line'> & { pointRadius?: number };
    raw: Set<string>;
    preset?: Preset;
  }>;

  interface MinMax {
    min: number;
    max: number;
  }

  interface ChartInfo {
    data: Array<ScatterDataPoint>;
    x: MinMax;
    y: MinMax;
  }

  interface LinesListItem {
    additional?: {
      text: string;
      value: ScatterDataPoint;
    };
    name: string;
  }

  interface ChartFormData {
    unparsedData: Array<string>;
    inputType: InputType;
    yName: string;
    preset: Preset;
    substances: Array<string>;
    presetData: Record<string, any>;
  }
}

export {};