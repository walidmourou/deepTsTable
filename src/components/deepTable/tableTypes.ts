//Types, interfaces and Enums

export enum CellTextAlign {
  right = "text-right",
  center = "text-center",
  left = "text-left",
}

export enum ColumnType {
  boolean = "Boolean",
  integer = "Integer",
  float = "Float",
  string = "String",
  timestamp = "Timestamp",
}

export type TableColumn = {
  id: string;
  label: string;
  minWidth: number;
  align?: CellTextAlign;
  type: ColumnType;
  format?: (value: any) => any;
  highlight?: boolean;
  invisible?: boolean;
  filtering?: boolean;
  searchable?: boolean;
  notEditable?: boolean;
  notAddable?: boolean;
};

export type Filter = {
  label: string;
  type?: ColumnType;
  values?: Array<string>;
  value: string | boolean | null;
};

export interface Dictionary<T> {
  [key: string]: T;
}

export type TableDataType = Array<Dictionary<string | number | boolean>>;
