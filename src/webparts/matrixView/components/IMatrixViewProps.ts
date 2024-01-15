export interface MatrixItem {
  url : string;
  displayName : string;
  description : string;
}

export interface Column {
  SortOrder: string
  Title: string
  Rows: Row[]
}

export interface Row {
  SortOrder: string
  Title: string
  FileRef: string
  ID: number
}
export interface MatrixRow {
  title : string;
  items : MatrixItem[];
}
export interface IMatrixViewProps {
  columns: Column[]
  errorMessage: string

}
