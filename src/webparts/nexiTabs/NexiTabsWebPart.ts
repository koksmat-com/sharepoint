import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
  
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'NexiTabsWebPartStrings';
import NexiTabs from './components/NexiTabs';
import { INexiTabsProps } from './components/INexiTabsProps';



export interface INexiTabsWebPartProps {
  tabs: string;
  nobreak: boolean;
  colors:string
  
}

/**
 * 
 * // use the web factory to target a specific web
https://pnp.github.io/pnpjs/sp/clientside-pages/#load-using-iwebloadclientsidepage */
export default class NexiTabsWebPart extends BaseClientSideWebPart<INexiTabsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<INexiTabsProps> = React.createElement(
      NexiTabs,
      {
        tabs: this.properties.tabs,
        noWhiteSpaceBreak: this.properties.nobreak,
        colors: this.properties.colors,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
       
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
                PropertyPaneTextField('tabs', {
                  multiline:true,
                  label: "Tabs"
                }),
                // PropertyPaneTextField('colors', {
                //   multiline:true,
                //   label: `Colors`,
                //   description:` Template:
                //   Copy and paste the following template into the field and replace the colors with your own.
                  
                //   {
                //     "activeText": "#2D32A9",
                //     "activeBack": "#C4B6EC15",
                //     "activeBorder": "#2px solid #2D32A9",
                
                //     "passiveText" :"#000000",
                //     "passiveBack": "rgba(126, 135, 152, 0.05)",
                //     "passiveBorder": "2px solid #2D32A900"
                //     }`
                // }),
                PropertyPaneToggle('nobreak', {
                  
                  label: "No white space break"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
