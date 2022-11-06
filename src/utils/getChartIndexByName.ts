import { ChartData } from 'chart.js';

export default (chartData: ChartData, name: string) => {
  return chartData.datasets.findIndex(({label}) => label?.includes(name));
};