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
import "@pnp/sp/site-users/web";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/navigation/web";
import "@pnp/sp/hubsites";
import "@pnp/sp/appcatalog";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { AssignFrom } from "@pnp/core"
import "@pnp/sp/webs";
import "@pnp/sp/hubsites/web";
import * as React from "react";
import * as ReactDOM from "react-dom";
//import { Dialog } from '@microsoft/sp-dialog';

import * as strings from "NexiTopNavApplicationCustomizerStrings";
import { enrichWithPageTabs, getQuickLaunch, NavigationNode } from "../../helpers";
import { TopNavigation, ITopNavigation } from "../../components/Topnav";
import { TopnavForProductCatalogue } from "../../components/TopnavForProductCatalogue";
import { Web } from "@pnp/sp/webs";

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

  showSearch: boolean;
  hideHome: boolean;
  homeUrl: string;
  showSiteTitle: boolean;
  siteUrl: string;
  siteTitle: string;

  magicboxurl: string
}



export interface ConfigItem {
  "odata.type": string
  "odata.id": string
  "odata.etag": string
  "odata.editLink": string
  FileSystemObjectType: number
  Id: number
  ServerRedirectedEmbedUri: any
  ServerRedirectedEmbedUrl: string
  Title: string
  SiteURL?: string
  HomeURL?: string
  magicboxurl?: string
  HubsiteID?: string
  NavigationBartype: "Product Catalogue" | "Core" | "Intranet"
  Starts?: string
  ShowSearch?: boolean
  DonttrackId?: number[]
  DonttrackStringId?: string[]
  LogoURL: any
  ContentTypeId: string
  OData__ColorTag: any
  ComplianceAssetId: any
  Trackingcode: string
  ID: number
  Modified: string
  Created: string
  AuthorId: number
  EditorId: number
  OData__UIVersionString: string
  Attachments: boolean
  GUID: string
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class NexiTopNavApplicationCustomizer extends BaseApplicationCustomizer<INexiTopNavApplicationCustomizerProperties> {
  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);


    const spWebInscope = spfi().using(SPFx(this.context));
    const currentWebUrl = this.context.pageContext.web.absoluteUrl
    const intra365Url = currentWebUrl.split("/sites/")[0] + "/sites/intra365"

    const spWebIntra365 = Web([spWebInscope.web, intra365Url]);


    const items: ConfigItem[] = await spWebIntra365.lists.getByTitle("Configuration").items();
    const hubsiteData = await spWebInscope.web.hubSiteData()


    const relatedHubSiteIds: string[] = hubsiteData.relatedHubSiteIds;



    const hubSiteId = relatedHubSiteIds[0];

    let configItem: ConfigItem = items.find(item => { return item.SiteURL === this.context.pageContext.web.absoluteUrl })
    if (!configItem) {
      configItem = items.find(item => { return item.HubsiteID === hubSiteId })
    }

    const script = document.createElement("script");
    const trackingCode: string = configItem?.Trackingcode ?? "";
    script.type = "text/javascript";
    script.innerText = trackingCode.replace(/(?:\r\n|\r|\n)/g, ';');

    document.body.appendChild(script);
    if ((document.location.href.indexOf("_layouts/15") < 0)
      && (document.location.href.toLowerCase().indexOf("/lists/") < 0)
      && (document.location.href.toLowerCase().indexOf("/sitepages/forms/") < 0)
      && (document.location.href.toLowerCase().indexOf("?mode=edit") < 0)
      
      ) {
      this.drawTopNav(configItem);
    }
    return Promise.resolve();
  }

  public get ctx(): ApplicationCustomizerContext {
    return this.context;
  }

  private drawTopNav(configItem: ConfigItem) {
    const run = async () => {
      if (!configItem) {
        return console.log("WARNING: No config found for this site")
      }
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
      
      let quickLaunch : any[] =[]
      
      try {
        quickLaunch = [...getQuickLaunch(
          this.context.pageContext.legacyPageContext
        )]
      } catch (error) {
        debugger
        console.log("error",error)
      }      
      





      const relatedHubSiteIds: string[] = hubsiteData.relatedHubSiteIds;


      const hubSiteId = relatedHubSiteIds[0];
      const hubSite = await sp.hubSites.getById(hubSiteId).getSite();
      const siteData = await hubSite();
      const serverRelativeUrl = siteData.ServerRelativeUrl;

      const hubKey = "nexinav" + serverRelativeUrl;
      let hubConfig = null;

      type NewType = NexiNavConfig;

      const defaultConfig: NewType = {
        enabled: true,
        parents: [],

        showSearch: configItem.ShowSearch,
        hideHome: false,
        homeUrl: configItem.HomeURL,
        showSiteTitle: true,
        siteUrl: "",
        siteTitle: "",

        magicboxurl: configItem.magicboxurl
      }
      hubConfig = {
        Key: hubKey,
        Value: JSON.stringify(defaultConfig)

      }





      const nexiNavConfig: NexiNavConfig = JSON.parse(hubConfig.Value);
      console.log("nexiNavConfig", nexiNavConfig)

      if (!nexiNavConfig.enabled) return

      nexiNavConfig.siteUrl = this.context.pageContext.web.absoluteUrl;
      nexiNavConfig.siteTitle = this.context.pageContext.web.title;

      const hubsiteNav: NavigationNode[] = hubsiteData.navigation; //await this.context.pageContext.web.getHubSiteData().then((data: IHubSiteWebData) => {

      const topNavigationProps: ITopNavigation = {
        applicationContext: this,
        left: quickLaunch.filter((node) => { return node.Title !== "Recent" }),
        right: hubsiteNav,
        sp,
        hubConfig: nexiNavConfig,
        homeUrl: nexiNavConfig.homeUrl,
        magicboxUrl: nexiNavConfig.magicboxurl,

      };
      const elem: React.ReactElement<ITopNavigation> = React.createElement(
        configItem.NavigationBartype !== "Product Catalogue" ? TopNavigation : TopnavForProductCatalogue,
        topNavigationProps
      );
      // eslint-disable-next-line @microsoft/spfx/pair-react-dom-render-unmount
      ReactDOM.render(elem, topNavHTMLElement);



    };
    run().then().catch(console.error);
  }
}
