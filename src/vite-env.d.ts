/* eslint-disable */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  type BtnVariant = 'success' | 'danger' | 'fullscreen' | 'default';
  type InputType = 'files' | 'textarea';

  type Preset = 'default' | 'abs';
  type PresetsTemplates = Record<Preset, string>;
  type PresetsExecuters = Record<Preset, (info: ChartInfo, name: string, datasetIndex: number, ...arg) => void>;

  type ChartsData = Record<string, {
    data: {
      labels: string[],
      datasets: ChartDataset[]
    },
    options: ChartOptions<'line'> & { pointRadius?: number },
  }>;

  interface Coordinates {
    x: number;
    y: number;
  }

  interface MinMax {
    min: number,
    max: number
  }

  interface ChartInfo {
    data: Coordinates[];
    x: MinMax;
    y: MinMax;
  }


  interface LinesListItem {
    additional?: string | number;
    name: string;
  }

  interface ChartFormData {
    unparsedData: string[];
    inputType: InputType;
    yName: string;
    preset: Preset;
    substances: Array<string>;
    presetData: Record<string, any>;
  }
}

export {};