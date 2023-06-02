export enum Colors {
  red= '#be4b15',
  green= '#52ce60',
  blue= '#6ea5f8',
  lightred = '#fd8852',
  lightblue = '#afd4fe',
  lightgreen = '#b9e986',
  pink = '#faadc1',
  purple = '#d689ff',
  orange = '#fdb400',
}

export enum Figure {
  hexagon = 'Hexagon',
  line = 'LineH',
}
export interface Column {
  name: string,
  iskey: boolean,
  color: Colors;
  figure: Figure;
}

export interface NodeModel {
  key: string,
  items: Column[],
  name: string,
}
