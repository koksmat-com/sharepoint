/**
// CTRL/CMD + D to execute the code
import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/appcatalog";

const sp = spfi().using(SPBrowser({ baseUrl: (window as any)._spPageContextInfo.webAbsoluteUrl }));

// wrapping the code inside self-excecuting async function
// enables you to use await expression
(async () => {
const w = await sp.getTenantAppCatalogWeb();
  const { Title } = await sp.web.select("Title")()
  console.log(`Web title: ${Title}`);
  
//  await w.setStorageEntity("nexinav/sites/NexiISProductCatalogue", `{"enabled":true,"hideHome":true}`);
  await w.setStorageEntity("nexinav/sites/nexiintra-hub", `{"enabled":true,"hideHome":false,"showSiteTitle":true,"homeUrl":"https://christianiabpos.sharepoint.com/sites/nexiintra-home"}`);
  //sp.web.setStorageEntity()
 //let x = await w.getStorageEntity("Test2")
 //console.log(x.Value)
})().catch(console.log)

 */
import { Log } from "@microsoft/sp-core-library";
import {
  ApplicationCustomizerContext,
  BaseApplicationCustomizer,
} from "@microsoft/sp-application-base";
import styles from "./AppCustomizer.module.scss";

import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/navigation/web";
import "@pnp/sp/hubsites";
import "@pnp/sp/appcatalog";
import { spfi, SPFx } from "@pnp/sp";

import "@pnp/sp/webs";
import "@pnp/sp/hubsites/web";
import * as React from "react";
import * as ReactDOM from "react-dom";
//import { Dialog } from '@microsoft/sp-dialog';

import * as strings from "NexiTopNavApplicationCustomizerStrings";
import { enrichWithPageTabs, getQuickLaunch, NavigationNode } from "../../helpers";
import { TopNavigation, ITopNavigation } from "../../components/Topnav";

const LOG_SOURCE: string = "NexiTopNavApplicationCustomizer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface INexiTopNavApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}
export type NexiNavParent = {
  title: string;
  url: string;
}
export type NexiNavConfig = {
  enabled: boolean;
  parents: NexiNavParent[];
  clarityId: string;
  matomoId: string;
  showSearch: boolean;
  hideHome: boolean;
  homeUrl: string;
  showSiteTitle: boolean;
  siteUrl : string;
  siteTitle : string;

}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class NexiTopNavApplicationCustomizer extends BaseApplicationCustomizer<INexiTopNavApplicationCustomizerProperties> {
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerText = `
  
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "g4arw8gw7u");

    
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//tracking.nets-intranets.com/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();


    `;
    document.body.appendChild(script);
    if (document.location.href.indexOf("_layouts/15") < 0) {
      this.drawTopNav();
    }
    return Promise.resolve();
  }

  public get ctx(): ApplicationCustomizerContext {
    return this.context;
  }

  private drawTopNav() {
    const run = async () => {
      const doc: Document = window.document;
      let topNavHTMLElement: HTMLElement = doc.querySelector(
        "." + styles.topNavigationContainer
      );

      if (!topNavHTMLElement) {
        topNavHTMLElement = doc.createElement("div");
        topNavHTMLElement.className = styles.topNavigationContainer
        document.body.appendChild(topNavHTMLElement);
      }


      // topNavHTMLElement.innerHTML = "<div></div>";
      // document.body.appendChild(topNavHTMLElement);
      const sp = spfi().using(SPFx(this.context));
      const hubsiteData = await sp.web.hubSiteData()
      const quickLaunch = [...getQuickLaunch(
        this.context.pageContext.legacyPageContext
      )]

      const tenantAppCatalogWeb = await sp.getTenantAppCatalogWeb();
      


      const relatedHubSiteIds: string[] = hubsiteData.relatedHubSiteIds;
      if (relatedHubSiteIds.length < 1) 
      {
        console.log("WARNING: No hubsite found for this site")
        return
      } 
      
        const hubSiteId = relatedHubSiteIds[0];
        const hubSite = await sp.hubSites.getById(hubSiteId).getSite();
        const siteData = await hubSite();
        const serverRelativeUrl = siteData.ServerRelativeUrl;

        const hubKey = "nexinav"+serverRelativeUrl;

        const hubConfig = await tenantAppCatalogWeb.getStorageEntity(hubKey)

        if (!hubConfig.Value) {
          console.log("WARNING: No hub config found for this site")
          console.log("hubKey",hubKey)
          return
        }


        const nexiNavConfig : NexiNavConfig = JSON.parse(hubConfig.Value);
        console.log("nexiNavConfig",nexiNavConfig)  
        
      if (!nexiNavConfig.enabled) return
      
        nexiNavConfig.siteUrl = this.context.pageContext.web.absoluteUrl;
        nexiNavConfig.siteTitle = this.context.pageContext.web.title;

        const hubsiteNav: NavigationNode[] = hubsiteData.navigation; //await this.context.pageContext.web.getHubSiteData().then((data: IHubSiteWebData) => {

        const topNavigationProps: ITopNavigation = {
          applicationContext: this,
          left: quickLaunch,
          right: hubsiteNav,
          sp,
          hubConfig: nexiNavConfig,
          homeUrl: nexiNavConfig.homeUrl

        };
        const elem: React.ReactElement<ITopNavigation> = React.createElement(
          TopNavigation,
          topNavigationProps
        );
        // eslint-disable-next-line @microsoft/spfx/pair-react-dom-render-unmount
        ReactDOM.render(elem, topNavHTMLElement);
        try {
          await enrichWithPageTabs(sp, quickLaunch);
        } catch (error) {
          console.log(error);
        }
        // eslint-disable-next-line @microsoft/spfx/pair-react-dom-render-unmount
        ReactDOM.render(elem, topNavHTMLElement);

      };
      run().then().catch(console.error);
    }
  }
