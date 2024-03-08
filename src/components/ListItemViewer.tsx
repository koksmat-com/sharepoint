import * as React from 'react';
import { useState } from 'react';
import Handlebars from 'handlebars';
export async function getToken(): Promise<string> {
    const { context } = await (window as any).moduleLoaderPromise
    const p = await context.aadTokenProviderFactory.getTokenProvider()

    const token = await p.getToken("https://graph.microsoft.com")
    return token
}



export interface IListItemViewer {
    ishidden?: boolean
    html : string
    script: string
    item : string
}



function isInFrame() {
    return (window.top !== window);
}


export const ItemView = (props: IListItemViewer): JSX.Element => {

   const {html,script,item,ishidden} = props
    const [isvisible, setisvisible] = useState(true)
    const [debug, setdebug] = useState(false)
  
   if (!isvisible) return <div></div>
   if (html == null) return <div></div>
   let compiledHTML 
   try {
    let template = Handlebars.compile(html)
    compiledHTML = template(JSON.parse(item))
   } catch (error) {
    compiledHTML = `<div style="color:"red">error</div>`
   }
   
    // "disabled" and checked in - will continue in branch
    return <div id="MAGICBUTTONLISTVIEW" style={{ position: "absolute"}}>
        <div style={{ position: "fixed", left: "0px", top: "132px", width: "100vw", height: "calc(100vh - 132px)",zIndex:"10000000", backgroundColor:"#ffffff" }}>
            <div style={{ display: "flex", }} >
               
                
                <div style={{maxWidth:"1200px",marginLeft:"auto",marginRight:"auto",overflow:"auto"}}>
                    
                    <div dangerouslySetInnerHTML={{ __html: compiledHTML }}></div>
{debug && <div> 
                    <div>Template</div>
                    <pre>
                        {html}
                    </pre>
                    <div>Data</div>
                    <pre>
                      
                        {item}
                    </pre>
                    
            </div>}
                </div>
              
               <div>
                <div>

               <button onClick={()=>setisvisible(false)}>Close</button> 
               </div><div>
               <button onClick={()=>setdebug(!debug)}>{debug?"Hide debug":"Show debug"}</button> 
               </div>
               </div>


            </div>

        </div>
    </div>

   
}



/**
 * 
 * let xxx = document.getElementById("MAGICBUTTONTOOLBAR");xxx.appendChild(Array.from(document.querySelectorAll('[data-automation-id="LanguageSelector"]'))[0])

 */