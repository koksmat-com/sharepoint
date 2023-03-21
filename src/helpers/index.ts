import { SPFI } from "@pnp/sp";

export interface NavigationNode {
    onOver?: (node: NavigationNode) => void;
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