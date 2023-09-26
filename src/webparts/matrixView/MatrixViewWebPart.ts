import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'MatrixViewWebPartStrings';
import MatrixView from './components/MatrixView';
import { IMatrixViewProps, MatrixRow } from './components/IMatrixViewProps';
import { SPFx,  spfi } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IMatrixViewWebPartProps {
  description: string;
  columnNames : string;
  columnsFieldName: string;
  rowSortOrderFieldName: string;
}


export interface SitePageItem {
  "odata.type": string
  "odata.id": string
  "odata.etag": string
  "odata.editLink": string
  FileSystemObjectType: number
  Id: number
  ServerRedirectedEmbedUri: any
  ServerRedirectedEmbedUrl: string
  ContentTypeId: string
  ComplianceAssetId: any
  WikiField: any
  Title?: string
  CanvasContent1?: string
  BannerImageUrl?: BannerImageUrl
  Description?: string
  PromotedState?: number
  FirstPublishedDate: any
  LayoutWebpartsContent?: string
  OData__AuthorBylineId?: number[]
  _AuthorBylineStringId?: string[]
  OData__TopicHeader: any
  OData__SPSitePageFlags?: string[]
  OData__SPCallToAction: any
  OData__OriginalSourceUrl: any
  OData__OriginalSourceSiteId: any
  OData__OriginalSourceWebId: any
  OData__OriginalSourceListId: any
  OData__OriginalSourceItemId: any
  ValueChain?: string
  OData__ColorTag: any
  SortOrder?: number
  ID: number
  Created: string
  AuthorId: number
  Modified: string
  EditorId: number
  OData__CopySource: any
  CheckoutUserId?: number
  OData__UIVersionString: string
  GUID: string
}

export interface BannerImageUrl {
  Description: string
  Url: string
}

export default class MatrixViewWebPart extends BaseClientSideWebPart<IMatrixViewWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _columns : MatrixRow[] = [];  

  public render(): void {
    
    const element: React.ReactElement<IMatrixViewProps> = React.createElement(
      MatrixView,
      {
       columns: this._columns,
   
       
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    const sp = spfi().using(SPFx(this.context));
    
    const pageItems: any[] = await sp.web.lists.getByTitle("Site Pages").items();
    this._columns = this.properties.columnNames.split(",").map(columnName=>{
      const column : MatrixRow = {
        title:columnName,
        items:pageItems.filter(pageItem=>{
          return pageItem[this.properties.columnsFieldName] === columnName
        }).map(pageItem=>{
          return {
            url:"#",
            displayName:pageItem.Title,
            description:pageItem.Description
          }
        })

      }
      return column
    }
    )
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
                PropertyPaneTextField('columnNames', {
                  label: "Columns"
                }),
                PropertyPaneTextField('columnsFieldName', {
                  label: "Columns Mapping Field Name"
                }),
                PropertyPaneTextField('columnsFieldName', {
                  label: "Columns Mapping Field Name"
                }),
                PropertyPaneTextField('rowSortOrderFieldName', {
                  label: "Row order Field Name"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
