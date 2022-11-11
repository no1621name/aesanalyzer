import { ChartData, ChartDataset, ScatterDataPoint } from 'chart.js';
import regression, { DataPoint, Result } from 'regression';

export const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const getChartIndexByName = (chartData: ChartData, name: string) => {
  return chartData.datasets.findIndex(({label}) => label?.includes(name));
};

export const parser = (unp: string): ChartInfo => {
  const chartData: ScatterDataPoint[] = unp.trim().split('\n')
    .map<ScatterDataPoint>((subS: string) => subS.split(' ')
      .reduce((obj: ScatterDataPoint, curr: string, currInd: number) => {
        Object.defineProperty(obj, currInd === 0 ? 'x' : 'y', {
          value: Number(curr),
          enumerable: true,
        });
        return obj;
      }, {} as ScatterDataPoint)
    );

  const xValues = chartData.map(d => d.x);
  const yValues = chartData.map(d => d.y);

  return {
    data: chartData,
    x: {
      max: +Math.max(...xValues).toFixed(3),
      min: Math.min(...xValues)
    },
    y: {
      max: +Math.max(...yValues).toFixed(3),
      min: Math.min(...yValues)
    }
  };
};

export const formula = (type: FormulaType = 'linear', dataset: ChartDataset<'line', (ScatterDataPoint | number)[]>): Result => {
  const serializedData: ReadonlyArray<DataPoint> = dataset.data.map((d: ScatterDataPoint | number) => {
    if(typeof d === 'number') {
      throw new Error();
    }
    return [d.x, d.y];
  });
  return regression[type](serializedData, {
    precision: 3
  });
};

export const getSetValueByIndex = <T, > (set: Set<T>, index: number) => {
  return [...set][index];
};