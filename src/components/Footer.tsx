import * as React from 'react';
import { useEffect, useState } from 'react';


import NexiTopNavApplicationCustomizer, { NexiNavConfig } from '../extensions/nexiTopNav/NexiTopNavApplicationCustomizer';

import { SPFI } from '@pnp/sp';
export interface Root {
    content: MenuContent
  }
  
  export interface MenuContent {
    menu: Menu[]
    title: string
    url: string
  }
  
  export interface Menu {
    childs: Menu[]
    isLink: boolean
    relativeURL: string
    title: string
  }
  
    

export interface IFooterProps {


    applicationContext: NexiTopNavApplicationCustomizer,
    content : Root,
    sp: SPFI;
    hubConfig: NexiNavConfig;
    homeUrl: string;
}



function isInFrame() {
    return (window.top !== window);
}



export const Footer = (props: IFooterProps): JSX.Element => {
   

    if (isInFrame()) {return null}




    return (
        <div style={{width:"100%",height:"600px",backgroundColor:"#ffccee"}}>

           
        </div>
    )
}
