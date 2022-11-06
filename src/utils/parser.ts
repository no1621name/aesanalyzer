export default (unp: string): ChartInfo => {
  const chartData: Coordinates[] = unp.trim().split('\n')
    .map<Coordinates>((subS: string) => subS.split(' ')
      .reduce((obj: Coordinates, curr: string, currInd: number) => {
        Object.defineProperty(obj, currInd === 0 ? 'x' : 'y', {
          value: Number(curr),
          enumerable: true,
        });
        return obj;
      }, {} as Coordinates)
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
