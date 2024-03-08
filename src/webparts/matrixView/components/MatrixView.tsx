import * as React from 'react';
import styles from './MatrixView.module.scss';
import { Column, IMatrixViewProps, Row } from './IMatrixViewProps';
import { escape, set } from '@microsoft/sp-lodash-subset';
import { useEffect, useState } from 'react';




const getKey = (row: number, column: number) : string =>  {
  let char = String.fromCharCode(65 + row + 1);
  return char  + column;
}



export default function MatrixViewFunction(props: IMatrixViewProps) {
const {
  columns,errorMessage,editColors,colors
} = props;


const RowCell = (props : {item : Row,rowIndex:number,columnIndex:number,updateCell : (color:string,tag:string) => void}) => {
  const {item,rowIndex,columnIndex} = props
  const [color, setcolor] = useState("")
  const [tag, settag] = useState("")

  useEffect(() => {
    setcolor(item.Color)
    settag(item.Tag)
  }, [item])
  
  return (
    <div className={styles.matrixcell} key={rowIndex}
    style={{backgroundColor:color}}
    
    onClick={()=>{
      if (editColors) return
      setzoomed(true)
      setpageUrl(item.FileRef)
    }}>
      <div style={{position:"relative",height:"60px"}}>
      <div style={{ textAlign:"center",verticalAlign:""}}>{item.Title}</div>

      {editColors && <div style={{position:"absolute", bottom:"0px", left:"0px",  padding:"0px", fontSize:"10px"}}><div style={{display:"flex"}}>
        {colors.map((color, index) => {
          return <div 
          onClick={()=>{
            setcolor(color.rgb)
            settag(color.tag)
            
          }}
          key={index}
          style={{backgroundColor:color.rgb, marginRight:"10px", cursor:"pointer", width:"20px", height:"20px", display:"inline-block"}}>
{color.tag}

          </div>
        })}
        
        </div></div>}
      <div style={{position:"absolute", bottom:"0px", right:"10px",  padding:"2px", fontSize:"10px"}}>
        
        {getKey(columnIndex,rowIndex)}</div>

</div>

      {/* <div >{item.}</div> */}
    </div>
  );
}

const updateCell = (columnIndex: number,rowIndex : number,color: string, tag: string) => {
  
}
const [zoomed, setzoomed] = useState(false)
const [pageUrl, setpageUrl] = useState("")
if (errorMessage) {
  return (
    <div style={{textAlign:"center",color:"red"}}>
      Data cannot be shown - Error message = 
      <pre>
      {JSON.stringify(errorMessage,null,2)}
      </pre>
    </div>
  )
}
return (
  <div>
    {zoomed && <div style={{
position: "fixed",
top: "0px",
width: "100vw",
left: "0px",
height: "100vh",
transform: "blur(1px)",
backgroundColor: "rgba(0,0,0,0.5)",
zIndex: 100000000
    }} onClick={() => {
      setzoomed(false)

    }}>
    <iframe src={pageUrl} style={{
      margin: "100px",
      height: "calc(100vh - 200px)",
      width: "calc(100vw - 200px)",
      position: "absolute",
      top:0,
      left:0,
     
      border:0}}>


      </iframe>
      
      
      
      </div>}
  <div className={styles.matrix}>
    <div style={{flexGrow:1}}/>
    {columns.map((column : Column, columnIndex : number) => {
      return (
        <div className={styles.matrixcolumn} key={columnIndex}>
          <div style={{display:"flex"}}>
            {columnIndex == 0 && 
          <div style={{

width:"12px",
height:"76px",

backgroundColor: "#2D32A9",
}}>
</div>}

{columnIndex != 0 && 
          <div style={{

width:0,
height:0,
borderTop: "38px solid #2D32A9",
borderBottom: "38px solid #2D32A9",
borderLeft: "12px solid transparent",
}}>
</div>}
          <div 
          className={styles.matrixcolumnheader}
          style={{
            backgroundColor: "#2D32A9",
            color: "#FFFFFF",
            alignSelf: "center" ,
            textAlign:"center",
            width: (column.Width*117+(column.Width-1)*16)+"px",

          }} >{column.Title}</div>
        
           
          <div style={{

            width:0,
            height:0,
            borderTop: "38px solid transparent",
            borderBottom: "38px solid transparent",
            borderLeft: "12px solid #2D32A9",
          }}>
            </div>
          </div>
          <div style={{display:"flex", flexWrap:"wrap"}}>
          {column.Rows.sort((a,b)=>{return a.SortOrder.localeCompare(b.SortOrder)}).map((item, rowIndex) => {
            return (
              <RowCell item={item} rowIndex={rowIndex} columnIndex={columnIndex} updateCell={function (color: string, tag: string): void {
                updateCell(columnIndex,rowIndex,color,tag)
              } }  />
            );
          })}
        </div>
        </div>
      );
    })}
     <div style={{flexGrow:1}}/>
  </div>
  </div>
);
  
}

// export  class MatrixView extends React.Component<IMatrixViewProps, {}> {
//   public render(): React.ReactElement<IMatrixViewProps> {
//     const {
//       columns
//     } = this.props;

//     return (
//       <div className={styles.matrix}>
//         {columns.map((column, index) => {
//           return (
//             <div className={styles.matrixcolumn} key={index}>
              
//               <div 
//               className={styles.matrixcolumnheader}
//               style={{
//                 backgroundColor: "#2D32A9",
//                 color: "#FFFFFF",
//                 alignSelf: "center" ,
//                 textAlign:"center"

//               }} >{column.Title}</div>
//               {column.Rows.map((item, index) => {
//                 return (
//                   <div className={styles.matrixcell} key={index}>
//                     <div style={{textAlign:"center"}}>{item.Title}</div>
//                     {/* <div >{item.}</div> */}
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         })}
//       </div>
//     );
//   }
// }
/**
 * 
 * Product & Customer Strategy,Sales & Marketing,Account Origination,Account Life Cycle,Card & PIN Life Cycle,Real-time transaction life cycle|Real-time Transaction Life Cycle,Clearing and Settlement life cycle|Clearing & Settlement Life Cycle, Card Fraud and Risk Management|Fraud & Risk Management
 * 
 * 
 * 
 * Account Life Cycle
Card & PIN Life Cycle
Real-time Transaction Life Cycle
Clearing & Settlement Life Cycle
Fraud & Risk Management
Dispute Management
Product Managment

 */ 