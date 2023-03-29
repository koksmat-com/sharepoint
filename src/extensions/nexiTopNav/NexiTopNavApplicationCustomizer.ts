import { Log } from "@microsoft/sp-core-library";
import {
  ApplicationCustomizerContext,
  BaseApplicationCustomizer,
} from "@microsoft/sp-application-base";
import styles from "./AppCustomizer.module.scss";

import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/navigation/web";
import { spfi, SPFx } from "@pnp/sp";

import "@pnp/sp/webs";
import "@pnp/sp/hubsites/web";
import * as React from "react";
import * as ReactDOM from "react-dom";
//import { Dialog } from '@microsoft/sp-dialog';

import * as strings from "NexiTopNavApplicationCustomizerStrings";
import { getQuickLaunch, NavigationNode } from "../../helpers";
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

    `;
    document.body.appendChild(script);

    this.drawTopNav();
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
        debugger 
        topNavHTMLElement = doc.createElement("div");
        topNavHTMLElement.innerHTML = "<div></div>";
        document.body.appendChild(topNavHTMLElement);
        const sp = spfi().using(SPFx(this.context));
        const hubsiteData  = await sp.web.hubSiteData()
        const quickLaunch = getQuickLaunch(
          this.context.pageContext.legacyPageContext
        );
        
        const hubsiteNav: NavigationNode[] = hubsiteData.navigation; //await this.context.pageContext.web.getHubSiteData().then((data: IHubSiteWebData) => {

        const topNavigationProps: ITopNavigation = {
          applicationContext: this,
          left: quickLaunch,
          right: hubsiteNav,
        };
        const elem: React.ReactElement<ITopNavigation> = React.createElement(
          TopNavigation,
          topNavigationProps
        );
        ReactDOM.render(elem, topNavHTMLElement);
      }
    };
    run().then().catch(console.error);
  }
}
