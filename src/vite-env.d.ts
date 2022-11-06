/* eslint-disable */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  type BtnVariant = 'success' | 'danger' | 'fullscreen' | 'default';

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

  type Preset = 'default' | 'abs';
  type PresetsTemplates = Record<Preset, string>;
  type PresetsExecuters = Record<Preset, (...arg) => { val: number, text: string }>;
  type InputType = 'files' | 'textarea';

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