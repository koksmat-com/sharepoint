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

import * as strings from 'MatrixViewWebPartStrings';
import MatrixView from './components/MatrixView';
import { Column, IMatrixViewProps, MatrixRow } from './components/IMatrixViewProps';
import { SPFx,  spfi } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
export interface IMatrixViewWebPartProps {
  description: string;
  columnNames : string;
  matrixFilePath : string;
  colorMapping : string;
  editColors : boolean;
  colors : string;
}



export interface BannerImageUrl {
  Description: string
  Url: string
}


const getColorMapping = (colorMapping : string) => {
  try {
    return JSON.parse(colorMapping);
  } catch (error) {
    return {}
  }
  
}

const getColorNameValues = ( colors : string) => {
  if (!colors) return [
    {title: "Red", rgb: "#FF0000",tag: "R"},
    {title: "Green", rgb: "#00FF00",tag:"G"},
    {title: "Blue", rgb: "#0000FF",tag:"B"},
  ]
  return colors.split("\n").map(color=>{
    const s = color.split("|")
    return {
      title: s[0],
      rgb: s[1],
      tag: s[2] ?? s[0].substring(0,1)
    }
  })
}
export default class MatrixViewWebPart extends BaseClientSideWebPart<IMatrixViewWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _columns : Column[] = [];  
private _errorMessage : string = "";
  public async render() {
    var errorMessage = "";
    const sp = spfi().using(SPFx(this.context));
    try {
      
   
    //const pageItems: any[] = await sp.web.lists.getByTitle("Site Pages").items();

    const matrixData = await sp.web.getFileByServerRelativePath(this.properties.matrixFilePath).getText();
    
    const matrix : Column[] = JSON.parse(matrixData)
    const editColors = this.properties.editColors;
    const colorMap = getColorMapping(this.properties.colorMapping)
    const columnsInOrder = this.properties.columnNames.split("\n")
    this._columns = []
    for (let i = 0; i < columnsInOrder.length; i++) {
      const s = columnsInOrder[i].split("|")
      const columnName = s[0]
      const column = matrix.find(column=>{
        return column.Title === columnName
      })
      if(column !== undefined){
        const w = parseInt(s[1])
        column.Width = w > 1 ? w : 1
        this._columns.push(column)
      }
      
    }
  } catch (error) {
    console.log("Load Matrix error ",error)
    errorMessage = error;
  }
    const element: React.ReactElement<IMatrixViewProps> = React.createElement(
      MatrixView,
      {
       columns: this._columns,
       errorMessage,
        editColors: this.properties.editColors,
        colors: getColorNameValues(this.properties.colors)
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
   
    
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
                  multiline: true,
                  label: "Columns"
                }),
                PropertyPaneToggle('editColors', {
                  onText: "Edit",
                  offText: "View",

                  label: "Mapping"
                }),
                PropertyPaneTextField('colors', {
                  multiline: true,

                  label: "Colors"
                }),
                PropertyPaneTextField('colorMapping', {
                  multiline: true,

                  label: "Mapping"
                }),
                PropertyPaneTextField('matrixFilePath', {
                  label: "Path to Matrix File"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
