import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'RolluppageWebPartStrings';
import Rolluppage from './components/Rolluppage';
import { IRolluppageProps } from './components/IRolluppageProps';
import { SPFx,  spfi } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IRolluppageWebPartProps {
  queryparameter: string;
  listname: string;
  fieldname: string;
  fieldname2: string;
  urlfield: string;
  height: string;
  configureUrl: string;
}

export default class RolluppageWebPart extends BaseClientSideWebPart<IRolluppageWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public async render() {
    const sp = spfi().using(SPFx(this.context));
    const search = document.location.search
    
    let searchFor = (search.split(this.properties.queryparameter+"=")[1]?.split("&")[0] ?? "").toLowerCase()
    searchFor = decodeURIComponent(searchFor)
    if (searchFor) {
      localStorage.setItem(this.properties.queryparameter,searchFor)
    }else{
      searchFor = localStorage.getItem(this.properties.queryparameter) ?? ""
    }
    const matchField = this.properties.fieldname
    const matchField2 = this.properties.fieldname2
    const items: any[] = await sp.web.lists.getByTitle( this.properties.listname).items();
   
    const item = items.find(item=>{

      const f1 = decodeURIComponent(item[matchField]??"")
      const f2 = decodeURIComponent(item[matchField2]??"")

      console.log(f1,f2,searchFor)
      
      const match = (f1.toLowerCase() === searchFor) || (f2.toLowerCase() === searchFor)
      return match
    
    })

    const element: React.ReactElement<IRolluppageProps> = React.createElement(
      Rolluppage,
      {
      url:item[this.properties.urlfield]?.Url,
      height:this.properties.height ?? "800px",
      configureUrl:this.properties.configureUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('queryparameter', {
                  label: "Query Parameter"
                }),
                PropertyPaneTextField('listname', {
                  label: "List Name"
                }),
                PropertyPaneTextField('fieldname', {
                  label: "Field Name to match"
                }),
                PropertyPaneTextField('fieldname2', {
                  label: "Alternative field Name to match"
                }),                
                PropertyPaneTextField('urlfield', {
                  label: "Field Name with URL"
                }),
                PropertyPaneTextField('height', {
                  label: "Height of webpart in px, include px suffix or other units"
                }),
                PropertyPaneTextField('configureUrl', {
                  label: "URL of profiling site"
                }),


                
              ]
            }
          ]
        }
      ]
    };
  }
}
