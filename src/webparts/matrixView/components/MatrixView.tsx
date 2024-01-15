import * as React from 'react';
import styles from './MatrixView.module.scss';
import { Column, IMatrixViewProps } from './IMatrixViewProps';
import { escape, set } from '@microsoft/sp-lodash-subset';
import { useState } from 'react';


export default function MatrixViewFunction(props: IMatrixViewProps) {
const {
  columns,errorMessage
} = props;

const [zoomed, setzoomed] = useState(false)
const [pageUrl, setpageUrl] = useState("")
if (errorMessage) {
  return (
    <div style={{textAlign:"center",color:"red"}}>
      Data cannot be shown - Error message = {errorMessage}
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
    {columns.map((column : Column, index : number) => {
      return (
        <div className={styles.matrixcolumn} key={index}>
          <div style={{display:"flex"}}>
            {index == 0 && 
          <div style={{

width:"12px",
height:"76px",

backgroundColor: "#2D32A9",
}}>
</div>}

{index != 0 && 
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
            textAlign:"center"

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
          {column.Rows.sort((a,b)=>{return a.SortOrder.localeCompare(b.SortOrder)}).map((item, index) => {
            return (
              <div className={styles.matrixcell} key={index} onClick={()=>{
                setzoomed(true)
                setpageUrl(item.FileRef)
              }}>
                <div style={{textAlign:"center"}}>{item.Title}</div>
                {/* <div >{item.}</div> */}
              </div>
            );
          })}
        </div>
      );
    })}
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