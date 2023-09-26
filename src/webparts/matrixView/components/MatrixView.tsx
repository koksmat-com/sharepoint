import * as React from 'react';
import styles from './MatrixView.module.scss';
import { IMatrixViewProps } from './IMatrixViewProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class MatrixView extends React.Component<IMatrixViewProps, {}> {
  public render(): React.ReactElement<IMatrixViewProps> {
    const {
      columns
    } = this.props;

    return (
      <div className={styles.tabs}>
        {columns.map((column, index) => {
          return (
            <div key={index}>
              
              <div 
              className={styles.tab}
              style={{
                backgroundColor: "#2D32A9",
                color: "#FFFFFF",
                alignSelf: "center" 

              }} >{column.title}</div>
              {column.items.map((item, index) => {
                return (
                  <div style={{
                    backgroundColor: "#7E87981A",
                    color: "#232834"


                  }} key={index}>
                    <div >{item.displayName}</div>
                    <div >{item.description}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
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