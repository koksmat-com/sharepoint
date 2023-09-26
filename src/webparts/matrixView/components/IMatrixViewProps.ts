export interface MatrixItem {
  url : string;
  displayName : string;
  description : string;
}

export interface MatrixRow {
  title : string;
  items : MatrixItem[];
}
export interface IMatrixViewProps {
  columns: MatrixRow[]


}
