/** Sum an array of numbers */
export const sumNumberArray = (inputs: number[]) =>
  inputs.reduce((acc, num) => (acc += num), 0);
