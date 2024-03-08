export interface MatrixItem {
  url : string;
  displayName : string;
  description : string;
}

export interface Column {
  Width: number
  SortOrder: string
  Title: string
  Rows: Row[]
}

export interface Row {
  SortOrder: string
  Title: string
  FileRef: string
  ID: number
  Color: string
  Tag: string
}
export interface MatrixRow {
  title : string;
  items : MatrixItem[];
}
export interface colorNameValue {
  title: string,
  rgb:string,
  tag: string
}
export interface IMatrixViewProps {
  columns: Column[]
  errorMessage: string
  editColors: boolean
  colors: colorNameValue[]

}
