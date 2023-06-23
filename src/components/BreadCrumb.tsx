import * as React from 'react';
import { useEffect, useState } from 'react';
import { getQuickLaunch, NavigationNode } from '../helpers';
import {
    PageContext
  } from '@microsoft/sp-page-context';
 


export interface IBreadCrumb {
    pageContext : PageContext
    showHome :boolean
}

export const  findNodeInNavigation = (navigationNodes:NavigationNode[],url:string)  => {
   
    const compare = (node:NavigationNode,parents:NavigationNode[])  : {node:NavigationNode,parents:NavigationNode[]} | undefined => {

        if (node.Url === url) {
            return {node,parents}
        }else{
            if (node?.Children?.length > 0) {
                for (let i = 0; i < node.Children?.length; i++) {
                    const child = node.Children[i];
                    const result = compare(child,[node,...parents,])
                    if (result) {
                        return result
                    }
                }
            }else{
                return null
            }
         
        }

    }




    for (let i = 0; i < navigationNodes.length; i++) {
      const node = navigationNodes[i];
      
      const result = compare(node,[])
      if (result) {
          return result
      }

    return null
  }
}

interface ILink {isSelf?:boolean,isLink?:boolean,text: string, link: string} 
export const  parentLinkHtml = (text: string, link: string) : ILink => {
    const isLink = link !== "http://linkless.header/"
    return {isLink,text,link} 
    
   
  }
  export const  selfLinkHtml = (text: string, link: string) => {

    return `<span style="color: #2D32AA">>${text}</span>`
  }


export const  buildBreadcrumb = (webTitle:string,webUrl:string,navigationNodes:NavigationNode[],url:string,showHome :boolean) : ILink[] => {
    const {node,parents} = findNodeInNavigation(navigationNodes,url) || {node:null,parents:[]}
    const root : ILink = !showHome ? null : {
        text: 'Home',
        isLink:true,
        link: 'https://christianiabpos.sharepoint.com/sites/nexiintra-home'
    }

    const self : ILink = {
        text: document.title,
        link: document.location.pathname,
        isSelf:true
    }
    if (node) {
        const breadcrumb = [root,parentLinkHtml(webTitle,webUrl), ...parents.reverse().map(parent => parentLinkHtml(parent.Title,parent.Url))]
        breadcrumb.push({isSelf:true, text:node.Title, link: node.Url})
        return breadcrumb
    }else{
        return [root,self]
    }

  }

export const BreadCrumb = (props:IBreadCrumb): JSX.Element => {
    const {
        pageContext
    } = props;

    const [breadcrumb, setbreadcrumb] = useState<ILink[]>([])
    const serverRequestPath = pageContext.legacyPageContext.serverRequestPath
    useEffect(() => {
    const quickLaunch = getQuickLaunch(pageContext.legacyPageContext)
    
    setbreadcrumb(buildBreadcrumb(pageContext.web.title, pageContext.web.serverRelativeUrl, quickLaunch, serverRequestPath,props.showHome))
    
    }, [serverRequestPath])
    return (<div style={{
        color:"#6E6E78",
        textDecoration:"none",
        fontSize:"12px",
        fontFamily: "'Ubuntu', sans-serif",
        display:"flex"
    }}>
       {/* <a style={{textDecoration:"none",color:"#6E6E78"}} href={pageContext.web.serverRelativeUrl}>{pageContext.web.title}</a> */}

        {breadcrumb.map((link,index) => {
            if (!link) return <span/>
            if (link.isSelf) {
                return (<span key={index} style={{color:"#2D32AA",paddingLeft:"8px"}}>{link.text}</span>)
            }
            
            else{
                return (<div>
                    {link.isLink && 
                    <a key={index} style={{textDecoration:"none",color:"#6E6E78",paddingRight:"8px",paddingLeft:"8px"}} href={link.link}>{link.text}</a>
                    }
                    {!link.isLink && 
                    <span key={index} style={{textDecoration:"none",color:"#6E6E78",paddingRight:"8px",paddingLeft:"8px"}} >{link.text}</span>
                    }
                
                <svg width="4" height="6" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.147461 5.29476L2.43746 2.99976L0.147461 0.704756L0.852461 -0.000244141L3.85246 2.99976L0.852461 5.99976L0.147461 5.29476Z" fill="#666666"/>
</svg>

                </div>)
            }
        })
        }

    </div>);
};
