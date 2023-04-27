import * as React from 'react';
import { useEffect, useState } from 'react';
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import { INexiNavigationSetupProps } from './INexiNavigationSetupProps';
import { SPFI } from '@pnp/sp';
import { getPages, getQuickLaunch, readTabsFromPage } from '../../../helpers';

const PageInfo = (props: {
  url: string, spWeb: SPFI
}): JSX.Element => {

  const [title, setTitle] = useState("");
  const [tabs, setTabs] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {

    readTabsFromPage(props.spWeb,props.url).then().catch((e) => console.log(e))

  }, [props.url])



  return (
    <div>

      {props.url}
      <h1>{title}</h1>
      <p>{description}</p>
      <pre>

        {tabs}
      </pre>
    </div>
  );
}


export default class NexiNavigationSetup extends React.Component<INexiNavigationSetupProps, {}> {






  public render(): React.ReactElement<INexiNavigationSetupProps> {
    const {
      //  spWeb,
      context
    } = this.props;


    const quickLaunch = getQuickLaunch(context.pageContext.legacyPageContext)
    const pages = getPages(quickLaunch);

    return (

      <div>
        <h1>spWeb.web.allProperties!!##</h1>
        <PageInfo url="/sites/IssuerProducts/SitePages/Product-Catalogue-Configuration.aspx" spWeb={this.props.spWeb} />
   
        <h1>pages</h1>
        <pre>
          {JSON.stringify(pages, null, 2)}
        </pre>
        <h1>Quick Launch</h1>

        <pre>
          {JSON.stringify(quickLaunch, null, 2)}
        </pre>

        <h1>legacyPageContext</h1>
        <pre>
          {JSON.stringify(context.pageContext.legacyPageContext, null, 2)}
        </pre>
      </div>
    );
  }
}
