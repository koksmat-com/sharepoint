import * as React from 'react';

import { IRolluppageProps } from './IRolluppageProps';


export default class Rolluppage extends React.Component<IRolluppageProps, {}> {
  public render(): React.ReactElement<IRolluppageProps> {
    const {
      url,
      height,
      configureUrl
    } = this.props;

   
  
  if(!url) return<div style={{width:"100%",textAlign:"center",fontSize:"24px"}}>
  <a href={configureUrl} target='_blank'>Click here to configure</a>
  </div>
 
    return (
  <section>
    <iframe src={url} style={{ width: "100%", height, border: 0 }} />
  </section>
);
  }
}
