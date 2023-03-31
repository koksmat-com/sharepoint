import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/webparts";
import "@pnp/sp/clientside-pages/web";


export type onOver = (node: NavigationNode) => void;

export interface NavigationNode {
    onOver?: onOver;
    onOut?: (node: NavigationNode) => void;
    Id?: number;
    Title: string;
    Url: string;
    IsDocLib?: boolean;
    IsExternal?: boolean;
    ParentId?: number;
    ListTemplateType?: number;
    AudienceIds?: any;
    CurrentLCID?: number;
    Children?: NavigationNode[];
    OpenInNewWindow?: any;
}



export interface NavigationInfo {
    isAudienceTargeted: boolean;
    quickLaunch: NavigationNode[];
    topNav: any[];
}
export interface IContext {
    navigationInfo: NavigationInfo;
}
export const getQuickLaunch = (context: IContext): NavigationNode[] => {
    return context?.navigationInfo?.quickLaunch

}

export const getPages = (navigationNodes: NavigationNode[]): NavigationNode[] => {

    const pages: NavigationNode[] = [];
    navigationNodes.forEach(node => {
        pages.push(...getPages(node.Children))
        if (!node.IsExternal && node.Url !== "http://linkless.header/") {
            pages.push(node);

        }
    });
    return pages;
}

export const readTabsFromPage = async (spWeb : SPFI, url:string) => {
    const page = await spWeb.web.loadClientsidePage(url);


    // findTabs();

/*
    function findTabs() {
        page.sections.forEach(section => {
            section.columns.forEach(column => {
                column.controls.forEach(control => {
                    //console.log(control)
                    if (control?.id === "9764a2f3-e4c4-41a4-82ee-e25a99cecde3") {
                        //debugger
                        // setTabs(control?.data.webPartData.properties?.tabs as string)
                    }



                });
            });
        });
    }
*/
    return [page?.title, page?.description, page?.sections] as const
}

export const  parentLinkHtml = (text: string, link: string) => {
    const isLink = link !== "http://linkless.header/"
    return isLink ? `<a href="${link}">${text}</a>` : text
  }
  export const  selfLinkHtml = (text: string, link: string) => {

    return text
  }



  export const  findNodeInNavigation = (navigationNodes:NavigationNode[],url:string)  => {
   
    const compare = (node:NavigationNode,parents:NavigationNode[])  : {node:NavigationNode,parents:NavigationNode[]} | undefined => {

        if (node.Url === url) {
            return {node,parents}
        }else{
            if (node.Children.length > 0) {
                for (let i = 0; i < node.Children.length; i++) {
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

export const  buildBreadcrumbHtml = (webTitle:string,webUrl:string,navigationNodes:NavigationNode[],url:string) : string => {
    const {node,parents} = findNodeInNavigation(navigationNodes,url) || {node:null,parents:[]}
    if (node) {
        const breadcrumb = [parentLinkHtml(webTitle,webUrl), ...parents.reverse().map(parent => parentLinkHtml(parent.Title,parent.Url))]
        breadcrumb.push(selfLinkHtml(node.Title,node.Url))
        return breadcrumb.join(" > ")
    }else{
        return ""
    }

  }


  export const pageTabs = async (sp : SPFI, relativeUrl:string) : Promise<NavigationNode[]>=> {
    // const { Title } = await sp.web.select("Title")()
   // const url = "/sites/IssuerProducts/SitePages/Debit-Card---Essential-Services.aspx"
   const links : NavigationNode[] = []
    try {
        
        const page = await sp.web.loadClientsidePage(relativeUrl)
    
     
        console.log(`Web title: ${page.title}`);
    for (let sectionId = 0; sectionId < page.sections.length; sectionId++) {
      const section = page.sections[sectionId]
  
      for (let columnId = 0; columnId < section.columns.length; columnId++) {
        const column = section.columns[columnId]
        for (let controlId = 0; controlId < column.controls.length; controlId++) {
          const control = column.controls[controlId]
        //  console.log(sectionId,columnId,controlId,control.data?.webPartData?.title )
          if (control.data?.webPartData?.title  === "NexiTabs"){
          
           const tabs = control.data?.webPartData?.properties?.tabs ? control.data?.webPartData?.properties?.tabs.split("\n") : []
           for (let tabId=0;tabId<tabs.length;tabId++){
              const tab = tabs[tabId]
              const hash =  encodeURI(tab)
              const hashedLink = relativeUrl + "#" + hash
              const navNode : NavigationNode = {
                  Title: tab,
                  Id: tabId,
                  Url: hashedLink
              }
              links.push(navNode)
             // console.log(tab,hashedLink)
           }
            
  
            
          }
  
        }
        
      }
      
    }  
} catch (error) {
        console.log(error)
}

return links
}


export const enrichWithPageTabs = async (sp : SPFI, navigationNodes : NavigationNode[]) =>{


    for (let i = 0; i < navigationNodes.length; i++) {
       
        const navigationNode = navigationNodes[i];
        if (navigationNode.Children.length > 0) {
            await enrichWithPageTabs(sp,navigationNode.Children)
        }else{
            navigationNode.Children = await pageTabs(sp,navigationNode.Url)
        }
    }
    
}