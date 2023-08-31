import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'NewsWebPartStrings';
import News from './components/News';
import { INewsProps } from './components/INewsProps';


import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/navigation/web";
import { spfi, SPFx } from "@pnp/sp";

export interface INewsWebPartProps {
  description: string;
}

export default class NewsWebPart extends BaseClientSideWebPart<INewsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<INewsProps> = React.createElement(
      News,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  async connectToSharePoint() {
      const sp = spfi().using(SPFx(this.context));
      const hubsiteData  = await sp.web.hubSiteData()
      
      
  }
  protected onInit(): Promise<void> {


    //this.connectToSharePoint().then((x) => {console.log(x)}).catch((err) => {console.log(err)});

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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}


const sample : any = [
  {
    "WorkId": "2151560777742641445",
    "Rank": "63817577474.9987",
    "Title": "RELAY Q1 2023 WRAP UP ARTICLE",
    "Author": "Fa Al Asadi",
    "Size": "10794",
    "Path": "https://christianiabpos.sharepoint.com/sites/relay/SitePages/RELAY-Q123-WRAP-UP.aspx",
    "Description": "\"Without continual growth and progress, such words as improvement, achievement, and success have no meaning.\" - Benjamin Franklin Time flies when you are making progress! As we close the first quarter of 2023, it is important to reflect on the miles…",
    "Write": "2023-04-26T12:04:40.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": "<ddd/><c0>Cards</c0>, and Data to Developers Docs and Collecting, each team has been working tirelessly <ddd/><c0>Cards</c0> Relay <c0>Cards</c0> API PoC finalized and integration with the Nordic acquiring platform “<ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://christianiabpos.sharepoint.com/_vti_bin/afdcache.ashx/authitem/sites/relay/SiteAssets/SitePages/87bubfjg/10568-Newsletter_news-3.png?_oat_=1682980586_a6a60f23831c736808a36abdd2da4a1f4c828d88cd6bb6e660f74822c84727b3&P1=1682965783&P2=-64532418&P3=1&P4=WIaEx34oFjZ5LrvPO88L8Xct89GJmNtIdvn6fYgXy8AGcOU07yXuTzrSkdL1pCE%2fCh76jqV7EuolBKF7b0IHZhoJUzvj2YkDHaVClRb3mlXOAhlDleezmYhpdAOxpSU8I7UHiJXFGBHzt3uO4H1muPTifZ7wyw4t8oXF9gN7gxVO1c2n3IyDdVMlMsVC1fttp%2ffUYdtKw9ap9%2bIocZH009oJ%2b8JKUAY5TwwuhmpJXXjUwyFxZRGeY4Nhbl8aCdWO9CBrgK9elfZ7bj6IExv7dwqS2XAIseLkZiF20HkLeawayLAPYxRYEEx3NY6xhQOZt2AIvuT6yj3I0o2mqoWkTQ%3d%3d&width=400",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C4118000CF492C5E1C40A41A8450F338D0FA7BD",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/relay/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "87",
    "ViewsRecent": "31",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": "https://christianiabpos.sharepoint.com/sites/relay/SiteAssets/__sitelogo__Full Logo+Team.png",
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/relay",
    "IsDocument": "true",
    "LastModifiedTime": "2023-04-26T12:04:40.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560777742641445",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/relay",
    "UniqueId": "{fcddd5f7-c3d4-474e-80b5-811b18e767de}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.1ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "87a27cb2-bff5-4008-8aaa-dc568c02e03d",
    "WebId": "da045735-2489-4ce4-8dc1-8db47a364413",
    "IsExternalContent": "false",
    "ListId": "6ab70779-b18f-4ecb-bec5-c450c377628b",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/relay/SitePages/RELAY-Q123-WRAP-UP.aspx",
    "IdentitySiteCollectionId": "87a27cb2-bff5-4008-8aaa-dc568c02e03d",
    "IdentityWebId": "da045735-2489-4ce4-8dc1-8db47a364413",
    "IdentityListId": "6ab70779-b18f-4ecb-bec5-c450c377628b",
    "IdentityListItemId": "fcddd5f7-c3d4-474e-80b5-811b18e767de",
    "DocumentSignature": "4959455088153365613;-5527041002225956848;902409895775158886;5788772204435566232;1201799881662363409;3146335726733378634"
  },
  {
    "WorkId": "2151560778851261427",
    "Rank": "63818000176.9395",
    "Title": "Nexi is a key player in new initiative to develop the future digital wallet for Europe",
    "Author": "Mele Fabrizio;Louise Fisker Boesen",
    "Size": "3463",
    "Path": "https://christianiabpos.sharepoint.com/sites/nexi/SitePages/Nexi-is-a-key-player-in-new-initiative-to-develop-the-future-digital-wallet-for-Europe.aspx",
    "Description": "As a leading paytech provider in Europe driving the transition towards a cashless Europe, Nexi has as part of the European Payment Initiative joined forces with 15 other shareholders, mainly leading banks in Europe, to build a new, euro-based digita…",
    "Write": "2023-04-25T06:15:47.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": "<ddd/><c0>card</c0> scheme, but the project has since been rescoped and is now launched as an account-to-<ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://christianiabpos.sharepoint.com/_vti_bin/afdcache.ashx/authitem/sites/nexi/SiteAssets/SitePages/Nexi-is-a-key-player-in-new-initiative-to-develop-the-future-digital-wallet-for-Europe/51609-EPI.png?_oat_=1683020621_64507322e4ec75070d44bcaab67c18910aa5a6daf97baec861dffba820d94392&P1=1682965649&P2=-64532418&P3=1&P4=P2yVIYffdfGxo4sYp%2fPVMYZbiVraC%2fkBObOJJWh6xgfR7BqoJ47YX9e9er9jRlK1mtEORSKUtqMpg6WV5wM2l2hp%2boY1tmguc5QmOd09ZIl0%2bCtGNXXlNPKiVAHlslVHO4P4qowMEw6KORGI7K9BoMJlXjwwku8sN4JtbrHxttD434Pxh7gXYNNQDYFlXYmpNWLP6MpPm6%2fDiWVtfwmwZFVM8A43Nzxuls5szw9JeAnviSIrU%2bJJcIMOrxir0fWdZ9xbFdXHtPKkm82RGNawUiDtQwvwsD3fpFRKCG732Fx2%2fOwIlR%2bGl0aU%2bSXEoXEdb1voXIvyO6QhIIAKHL40rg%3d%3d&width=400",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C41180098CBDA89FB50C6429569B22A399E8A0B",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/nexi/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "424",
    "ViewsRecent": "410",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": "https://christianiabpos.sharepoint.com/sites/nexi/SiteAssets/__sitelogo__getsitelogo.png",
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/nexi",
    "IsDocument": "true",
    "LastModifiedTime": "2023-04-25T06:15:47.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560778851261427",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/nexi",
    "UniqueId": "{1aaa132a-bab6-43e1-840b-d80de2ea6d1f}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.2ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "1536ed37-6552-45f9-8ce5-5816ffd2d6d2",
    "WebId": "cc95a11c-cf0d-4497-9bdb-d2bcabe52fd9",
    "IsExternalContent": "false",
    "ListId": "a715866d-7916-442b-b394-0a2b3064bd7d",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/nexi/SitePages/Nexi-is-a-key-player-in-new-initiative-to-develop-the-future-digital-wallet-for-Europe.aspx",
    "IdentitySiteCollectionId": "1536ed37-6552-45f9-8ce5-5816ffd2d6d2",
    "IdentityWebId": "cc95a11c-cf0d-4497-9bdb-d2bcabe52fd9",
    "IdentityListId": "a715866d-7916-442b-b394-0a2b3064bd7d",
    "IdentityListItemId": "1aaa132a-bab6-43e1-840b-d80de2ea6d1f",
    "DocumentSignature": "-8938915013631970369;-6405014293365614981;1752483039192308199;-8707513861949380072;3985494623483384189;-9167997960518796924"
  },
  {
    "WorkId": "2151560772567151535",
    "Rank": "63815687366.2333",
    "Title": "2023-Q1 Newsletter, The Spring Edition",
    "Author": "Majken Birthe Hillestrøm",
    "Size": "18899",
    "Path": "https://christianiabpos.sharepoint.com/sites/CustomerImplementationNetsGroup/SitePages/2023-Q1.aspx",
    "Description": "IN THIS ISSUE 1 - The role of P&PM in the new organisation 2 - Update from PMO & Portfolio 3 - Update from Test 4 - Client Success Stories 4.1 Danubio Phase 1 integration 4.2 PBZ Euroconversion readiness 4.3 OmaSB Lieto Merger 5 - Spring celebration…",
    "Write": "2023-04-13T09:19:13.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": " IN THIS ISSUE 1 - The role of P&PM in the new organisation 2 - Update from PMO & Portfolio 3 - Update from Test 4 - Client Success Stories 4.1 Danubio Phase 1 integration 4.2 PBZ<ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://cdn.hubblecontent.osi.office.net/m365content/publish/00053e7d-4d94-44fe-a440-e6e1d3f3b38e/thumbnails/large.jpg?file=515603514.jpg",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C4118002769D518D0A7994497E989E46209BA2C",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/CustomerImplementationNetsGroup/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "101",
    "ViewsRecent": "1",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": "https://christianiabpos.sharepoint.com/sites/CustomerImplementationNetsGroup/_api/GroupService/GetGroupImage?id='248ba1b3-6238-4494-bea1-c80ef3911be6'&hash=637940822485042178",
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/CustomerImplementationNetsGroup",
    "IsDocument": "true",
    "LastModifiedTime": "2023-04-13T09:19:13.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560772567151535",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/CustomerImplementationNetsGroup",
    "UniqueId": "{849fea0a-a323-4c23-a8f6-74b1a43e030c}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.3ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "4044b2a4-9164-476e-b3d9-d3c5fff2763e",
    "WebId": "15bf6040-13a6-4d80-9c11-5127053f11cb",
    "IsExternalContent": "false",
    "ListId": "1a7b3c00-9366-41af-a920-a94bc7b90290",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/CustomerImplementationNetsGroup/SitePages/2023-Q1.aspx",
    "IdentitySiteCollectionId": "4044b2a4-9164-476e-b3d9-d3c5fff2763e",
    "IdentityWebId": "15bf6040-13a6-4d80-9c11-5127053f11cb",
    "IdentityListId": "1a7b3c00-9366-41af-a920-a94bc7b90290",
    "IdentityListItemId": "849fea0a-a323-4c23-a8f6-74b1a43e030c",
    "DocumentSignature": "-6179389900835450384;7269292470376982415;-7633098026892136877;-504293288394728984;7147370548498399621;-5580159398980448364"
  },
  {
    "WorkId": "2151560776611381383",
    "Rank": "63816970667.9072",
    "Title": "Outcome Easy PI planning 23.2",
    "Author": "Samuel Kerem",
    "Size": "11427",
    "Path": "https://christianiabpos.sharepoint.com/sites/Easy/SitePages/Outcome-Easy-PI-planning-23.2.aspx",
    "Description": "We're now after much hard work from all of the teams done with PI-2 planning and it's respective priorities. PI 23.2 runs between 10/4 - 16/6, please see the committed capabilities with additional details below. If you have further questions, feel f…",
    "Write": "2023-04-13T08:19:12.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": " We're now after much hard work from all of the teams done with PI-2 planning and it's respective priorities. PI 23.2 runs between 10/4 - 16/6, please see the committed capabilities<ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://cdn.hubblecontent.osi.office.net/m365content/publish/6ca8c14c-d90a-4dff-99d6-380a2e03c77d/thumbnails/large.jpg?file=664954520.jpg",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C411800DEF99994A096414C97014D6EDCD2A630",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/Easy/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "51",
    "ViewsRecent": "2",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": null,
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/Easy",
    "IsDocument": "true",
    "LastModifiedTime": "2023-04-13T08:19:12.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560776611381383",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/Easy",
    "UniqueId": "{2dbb6ce3-dd17-4467-8361-6ae643f75a4b}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.4ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "6eeab073-7cdc-4adc-b3c6-ccbbbfc5df17",
    "WebId": "3ebeab08-b82b-4584-b904-a50ca5de31bf",
    "IsExternalContent": "false",
    "ListId": "8ea75d25-7070-409e-9576-94adf6dc65e5",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/Easy/SitePages/Outcome-Easy-PI-planning-23.2.aspx",
    "IdentitySiteCollectionId": "6eeab073-7cdc-4adc-b3c6-ccbbbfc5df17",
    "IdentityWebId": "3ebeab08-b82b-4584-b904-a50ca5de31bf",
    "IdentityListId": "8ea75d25-7070-409e-9576-94adf6dc65e5",
    "IdentityListItemId": "2dbb6ce3-dd17-4467-8361-6ae643f75a4b",
    "DocumentSignature": "-419291199711156565;6811602636305041975;7922828636737527679;-2952624834285801886;-8945075406941338549;-3987775934498148089"
  },
  {
    "WorkId": "2151560772700641427",
    "Rank": "63815594556.5203",
    "Title": "Unlock the Power of Our Exclusive Solution with the Austrian Pharmacists Association”.",
    "Author": "Jamal Febo",
    "Size": "5963",
    "Path": "https://christianiabpos.sharepoint.com/sites/Easy/SitePages/Unlock-the-Power-of-Our-Exclusive-Marketplace-Solution-with-the-Austrian-Pharmacy-Association”.aspx",
    "Description": "Facts / Background The Austrian Pharmacists Association represents the interests of independent pharmacists in Austria. The association has over 3,000 members and is committed to promoting the health and well-being of the population. The association…",
    "Write": "2023-03-29T20:04:22.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": "<ddd/><c0>Card</c0> Transaction outside of Austria since we have regulations, f.e. sale prohibition of \"<ddd/><c0>cards</c0> are accepted. ​​​​​​​To automate the process and verification we have developed a <ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://cdn.hubblecontent.osi.office.net/m365content/publish/27ae9c9a-7bd1-45ca-9548-9680805aa149/thumbnails/large.jpg?file=1290302635.jpg",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C411800DEF99994A096414C97014D6EDCD2A630",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/Easy/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "132",
    "ViewsRecent": "4",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": null,
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/Easy",
    "IsDocument": "true",
    "LastModifiedTime": "2023-03-29T20:04:22.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560772700641427",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/Easy",
    "UniqueId": "{24c9875e-ab62-4e2e-bff6-0a7e63667964}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.5ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "6eeab073-7cdc-4adc-b3c6-ccbbbfc5df17",
    "WebId": "3ebeab08-b82b-4584-b904-a50ca5de31bf",
    "IsExternalContent": "false",
    "ListId": "8ea75d25-7070-409e-9576-94adf6dc65e5",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/Easy/SitePages/Unlock-the-Power-of-Our-Exclusive-Marketplace-Solution-with-the-Austrian-Pharmacy-Association”.aspx",
    "IdentitySiteCollectionId": "6eeab073-7cdc-4adc-b3c6-ccbbbfc5df17",
    "IdentityWebId": "3ebeab08-b82b-4584-b904-a50ca5de31bf",
    "IdentityListId": "8ea75d25-7070-409e-9576-94adf6dc65e5",
    "IdentityListItemId": "24c9875e-ab62-4e2e-bff6-0a7e63667964",
    "DocumentSignature": "-6548736572362957859;8671153296854112537;712242114687429010;-669107264934324446;6608024359522843505;195309345321252601"
  },
  {
    "WorkId": "2151560769099421553",
    "Rank": "63814927564.8659",
    "Title": "How we support our Merchants to avoid fines!",
    "Author": "Jamal Febo",
    "Size": "3954",
    "Path": "https://christianiabpos.sharepoint.com/sites/Easy/SitePages/We-Support-Our-Customers-to-Avoid-Fines.aspx",
    "Description": "Last week, we  (Customer Excellence) sent out our first round of communications to our Easy customers that are designed to educate them on changes to Card Scheme regulations that could impact their business.  This email gives our customers informati…",
    "Write": "2023-03-20T17:06:13.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": "<ddd/><c0>Card</c0> Scheme regulations that could impact their business. This email gives our customers <ddd/><c0>Card</c0> Scheme regulations that could impact their business. This email gives our customers <ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://cdn.hubblecontent.osi.office.net/m365content/publish/6ef17eeb-fae5-4ffa-913b-8265d063f586/thumbnails/large.jpg?file=482147685.jpg",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C411800DEF99994A096414C97014D6EDCD2A630",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/Easy/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "27",
    "ViewsRecent": "0",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": null,
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/Easy",
    "IsDocument": "true",
    "LastModifiedTime": "2023-03-20T17:06:13.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560769099421553",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/Easy",
    "UniqueId": "{f509b5ae-0e50-4523-8d37-e68b6add2475}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.6ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "6eeab073-7cdc-4adc-b3c6-ccbbbfc5df17",
    "WebId": "3ebeab08-b82b-4584-b904-a50ca5de31bf",
    "IsExternalContent": "false",
    "ListId": "8ea75d25-7070-409e-9576-94adf6dc65e5",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/Easy/SitePages/We-Support-Our-Customers-to-Avoid-Fines.aspx",
    "IdentitySiteCollectionId": "6eeab073-7cdc-4adc-b3c6-ccbbbfc5df17",
    "IdentityWebId": "3ebeab08-b82b-4584-b904-a50ca5de31bf",
    "IdentityListId": "8ea75d25-7070-409e-9576-94adf6dc65e5",
    "IdentityListItemId": "f509b5ae-0e50-4523-8d37-e68b6add2475",
    "DocumentSignature": "-6496876743146059571;7351827758047730593;8207524594564698367;4439204173630289793;7190578664672826496;495718442838494057"
  },
  {
    "WorkId": "2151560639071492912",
    "Rank": "63791573268.284",
    "Title": "Google Design Sprint Workshops at Relay",
    "Author": "Fa Al Asadi",
    "Size": "6400",
    "Path": "https://christianiabpos.sharepoint.com/sites/relay/SitePages/Google-Design-Sprint-Workshops-at-Relay.aspx",
    "Description": "Relay Recently Held 2 Design Sprint Workshops in Denmark and Sweden ​​​​​​​ Melissa Nilsson , Director of Design at Relay and Relay UX design team has recently held two 5-days Google Design sprint workshops in both Denmark and Sweden for different p…",
    "Write": "2023-03-13T12:37:31.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": "<ddd/><c0>cards</c0>, APMs, strategy, Easy checkout, and Dankort. ​​​​​During the first phase of the <ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://christianiabpos.sharepoint.com/_vti_bin/afdcache.ashx/authitem/sites/relay/SiteAssets/SitePages/Google-Design-Sprint-Workshops-at-Relay!(1)/37732-google-design-sprint-process.jpg?_oat_=1683024014_755c1040910f0eb84f25ce3b61c86783b524bd8199e0a5f1f8100eafb2270197&P1=1682966356&P2=-64532418&P3=1&P4=PHfqxom7KrWv9gbEq8sG28SdlgOkObhgeiGDyvmvdSB3Im7rz1%2bQq3%2birpI9zB4%2bUbeVW79k%2bqzvAt%2ft8SOJtxE2PwIQFoXv3MMUohQ1LQGFBsfVeTUMrZH0T9iBaN4z4FS57ku8gUx6GKAmyUh6QAQkZBgZstHdtsOEDcciRTl8Tyl796tZ%2fr4gQWLPBACncfStVZnV%2bRA8WzK%2foTq%2bNy1xr8P%2fbzUnKbMozOfXbU%2fZqpJwpTKaGt3F%2b3o%2b5FRb1Tc8zfPPQFxQ0F8sl6wdmBHolmFaJuQVOkeyElmDv6KuFXtmg8WffsrfMNo2lZhWk75D9PTzxZngpOHcVkhzmg%3d%3d&width=400",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C4118000CF492C5E1C40A41A8450F338D0FA7BD",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/relay/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "98",
    "ViewsRecent": "2",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": "https://christianiabpos.sharepoint.com/sites/relay/SiteAssets/__sitelogo__Full Logo+Team.png",
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/relay",
    "IsDocument": "true",
    "LastModifiedTime": "2023-03-13T12:37:31.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560639071492912",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/relay",
    "UniqueId": "{f54e974a-72c6-42d6-9985-6a3377fb30a3}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.7ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "87a27cb2-bff5-4008-8aaa-dc568c02e03d",
    "WebId": "da045735-2489-4ce4-8dc1-8db47a364413",
    "IsExternalContent": "false",
    "ListId": "6ab70779-b18f-4ecb-bec5-c450c377628b",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/relay/SitePages/Google-Design-Sprint-Workshops-at-Relay.aspx",
    "IdentitySiteCollectionId": "87a27cb2-bff5-4008-8aaa-dc568c02e03d",
    "IdentityWebId": "da045735-2489-4ce4-8dc1-8db47a364413",
    "IdentityListId": "6ab70779-b18f-4ecb-bec5-c450c377628b",
    "IdentityListItemId": "f54e974a-72c6-42d6-9985-6a3377fb30a3",
    "DocumentSignature": "-9208011136404560485;-5916788281052653522;-3733218511512347417;-3427764894353323851;-6512517049746106157;-4087099028668142710"
  },
  {
    "WorkId": "2151560766422391367",
    "Rank": "63813943770.3994",
    "Title": "What do you know about Relay?",
    "Author": "Fa Al Asadi",
    "Size": "5058",
    "Path": "https://christianiabpos.sharepoint.com/sites/relay/SitePages/What-is-Relay-(1).aspx",
    "Description": "What if you never had to say no to a merchant when they asked if we could support a local payment method? What if it did not matter which product they chose because they all had the same robust level of support? What if you could always be as compet…",
    "Write": "2023-03-09T08:27:09.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": "<ddd/><c0>Cards</c0> ​​​​​​​ Relay <c0>Cards</c0> Gateway allows centralizing the acquirer connections and 3DS <ddd/><c0>card</c0> processing. ​​​​​​​ Learn more about Relay <c0>Cards</c0> Relay Collecting ​​​​​​​Relay <ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://christianiabpos.sharepoint.com/_vti_bin/afdcache.ashx/authitem/sites/relay/SiteAssets/SitePages/What-is-Relay-(1)/27969-channel-icons.png?_oat_=1683003934_4dc726132e9cbf0753293231f41371ab4d2d6471adce446d07195e01b8274010&P1=1682966597&P2=-64532418&P3=1&P4=uqor8krCMoLRx1rYtytunF4XZqJPWRzp9TAgMd6XQmI1MGTPr8b5uToKuK0ZthQZaCYMvOiGIEV9MlJk9WXaD8%2bZhO2vMigtBHH5ZhmCuVWWJzYxeBwbNTEOu%2bfujXw478GKCSD8MLM%2baQgW%2bvdcvACQH45TkeUsTV2xsq0Dxj%2flsvqQKshOnNf6b%2brsFq50xEg0IU0k0LUzru0g%2bWGQ6rrQdoOFTqiBY79PLrj3WLM6I6t1tC%2f5TAy9e5Fclg0g5v%2ft0r5Z7b8yCrte7L52%2bvLIfKM2n%2fXUQSi5OCi4Z6ny33lrvIm9MKJoZeaTu7DnS1NIXy69vq9jo4R7TSo6Zw%3d%3d&width=400",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C4118000CF492C5E1C40A41A8450F338D0FA7BD",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/relay/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "137",
    "ViewsRecent": "3",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": "https://christianiabpos.sharepoint.com/sites/relay/SiteAssets/__sitelogo__Full Logo+Team.png",
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/relay",
    "IsDocument": "true",
    "LastModifiedTime": "2023-03-09T08:27:09.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560766422391367",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/relay",
    "UniqueId": "{7e8ae5d8-2a2a-40f8-a0d6-4111f2d8977f}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.8ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "87a27cb2-bff5-4008-8aaa-dc568c02e03d",
    "WebId": "da045735-2489-4ce4-8dc1-8db47a364413",
    "IsExternalContent": "false",
    "ListId": "6ab70779-b18f-4ecb-bec5-c450c377628b",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/relay/SitePages/What-is-Relay-(1).aspx",
    "IdentitySiteCollectionId": "87a27cb2-bff5-4008-8aaa-dc568c02e03d",
    "IdentityWebId": "da045735-2489-4ce4-8dc1-8db47a364413",
    "IdentityListId": "6ab70779-b18f-4ecb-bec5-c450c377628b",
    "IdentityListItemId": "7e8ae5d8-2a2a-40f8-a0d6-4111f2d8977f",
    "DocumentSignature": "7110210180502389252;-852333284686114341;6512192647531268410;4646042738544896809;-3651994419279749775;-834229585089170045"
  },
  {
    "WorkId": "2151560576441461576",
    "Rank": "63743706687.33",
    "Title": "Payment Application │ Latest News",
    "Author": "Stuart Murray",
    "Size": "15775",
    "Path": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products/SitePages/Payment-Application-Latest-News.aspx",
    "Description": "February 2023 Viking ​​​​​​​ Version 1.01.0 From February 2023, software version 1.01.0 will be used as standard for the following terminals on the Viking platform: Lane/3000 Move/3500 Desk/3500 Link/2500 All new payment terminal orders and exchange…",
    "Write": "2023-02-17T10:38:48.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": "<ddd/><c0>Card</c0> + code 81. The multiple upgrades and improvement include ■ UI improvements Green <ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://cdn.hubblecontent.osi.office.net/m365content/publish/20db034f-283c-4c2f-a018-d34597532840/thumbnails/large.jpg?file=1197792345.jpg",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C411800AAF9943912480947AAE404C880DF521A",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "369",
    "ViewsRecent": "1",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products/SiteAssets/__siteIcon__.png",
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products",
    "IsDocument": "true",
    "LastModifiedTime": "2023-02-17T10:38:48.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560576441461576",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products",
    "UniqueId": "{21481f43-2392-4f03-a3f1-e583002ffaec}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.9ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "80d26ee5-cad8-4b7f-8d19-f8348629a268",
    "WebId": "4eff0b4a-495e-4c3b-914c-722a972d9e2e",
    "IsExternalContent": "false",
    "ListId": "ee64e89a-1c6d-4d87-8365-7cce1eb1fc19",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products/SitePages/Payment-Application-Latest-News.aspx",
    "IdentitySiteCollectionId": "80d26ee5-cad8-4b7f-8d19-f8348629a268",
    "IdentityWebId": "4eff0b4a-495e-4c3b-914c-722a972d9e2e",
    "IdentityListId": "ee64e89a-1c6d-4d87-8365-7cce1eb1fc19",
    "IdentityListItemId": "21481f43-2392-4f03-a3f1-e583002ffaec",
    "DocumentSignature": "-4440559620535791784;-393616715998227983;5062720169850577597;2506359643699511840;899922529772319341;-1214219248194448523"
  },
  {
    "WorkId": "2151560576437582367",
    "Rank": "63743708011.187",
    "Title": "Terminal Hardware │Latest",
    "Author": "Stuart Murray",
    "Size": "16268",
    "Path": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products/SitePages/TermminalHardwareNews.aspx",
    "Description": "Hardware news on payment terminals and accessories, including the latest stock, supply chain, and lifecycle issues. NB: This page is updated at the end of each month. February 2023 End-of-Sale on iUN terminals extended for twelve months Payment Card…",
    "Write": "2023-02-17T10:27:21.0000000Z",
    "CollapsingStatus": "0",
    "HitHighlightedSummary": "<ddd/><c0>Card</c0> Industry (PCI) have extended the official End-of-Sale date for PCI PTS 4 unattended <ddd/><c0>Card</c0>… Hardware news on payment terminals and accessories, including the latest stock, <ddd/><c0>Card</c0> <ddd/>",
    "HitHighlightedProperties": null,
    "contentclass": "STS_ListItem_WebPageLibrary",
    "PictureThumbnailURL": "https://cdn.hubblecontent.osi.office.net/m365content/publish/4d99236b-584b-482f-a4c5-51b17f43a47d/thumbnails/large.jpg?file=1042691858.jpg",
    "ServerRedirectedURL": null,
    "ServerRedirectedEmbedURL": null,
    "ServerRedirectedPreviewURL": null,
    "FileExtension": "aspx",
    "ContentTypeId": "0x0101009D1CB255DA76424F860D91F20E6C411800AAF9943912480947AAE404C880DF521A",
    "ParentLink": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products/SitePages/Forms/ByAuthor.aspx",
    "ViewsLifeTime": "282",
    "ViewsRecent": "8",
    "SectionNames": null,
    "SectionIndexes": null,
    "SiteLogo": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products/SiteAssets/__siteIcon__.png",
    "SiteDescription": null,
    "deeplinks": null,
    "importance": null,
    "SiteName": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products",
    "IsDocument": "true",
    "LastModifiedTime": "2023-02-17T10:27:21.0000000Z",
    "FileType": "aspx",
    "IsContainer": "false",
    "WebTemplate": null,
    "ResultTypeIdList": "0",
    "ResultTypeId": "0",
    "SecondaryFileExtension": "aspx",
    "RenderTemplateId": "~sitecollection/_catalogs/masterpage/Display Templates/Search/Item_Default.js",
    "DocId": "2151560576437582367",
    "docaclmeta": null,
    "SPWebUrl": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products",
    "UniqueId": "{53a95a84-16f6-4722-98d2-7454aaa9d938}",
    "ProgId": null,
    "LinkingUrl": null,
    "piSearchResultId": "ARIAǂac82bded-cce3-2edb-dd75-c70a8e9d475dǂ13cd375a-2956-47a6-9ada-2541af6d14a8ǂac82bded-cce3-2edb-dd75-c70a8e9d475d.1000.10ǂ",
    "GeoLocationSource": "EUR",
    "SiteId": "80d26ee5-cad8-4b7f-8d19-f8348629a268",
    "WebId": "4eff0b4a-495e-4c3b-914c-722a972d9e2e",
    "IsExternalContent": "false",
    "ListId": "ee64e89a-1c6d-4d87-8365-7cce1eb1fc19",
    "PartitionId": null,
    "UrlZone": "0",
    "Culture": null,
    "OriginalPath": "https://christianiabpos.sharepoint.com/sites/intranets-ms-products/SitePages/TermminalHardwareNews.aspx",
    "IdentitySiteCollectionId": "80d26ee5-cad8-4b7f-8d19-f8348629a268",
    "IdentityWebId": "4eff0b4a-495e-4c3b-914c-722a972d9e2e",
    "IdentityListId": "ee64e89a-1c6d-4d87-8365-7cce1eb1fc19",
    "IdentityListItemId": "53a95a84-16f6-4722-98d2-7454aaa9d938",
    "DocumentSignature": "-1244637523549067997;-6823564001609511029;216227172468347464;-8337459586113070370;8035571567860005847;374348742638581065"
  }
]



/**
 // CTRL/CMD + D to execute the code
import { spfi, SPBrowser } from "@pnp/sp";
import {  SearchResults, SearchQueryInit, ISearchResult,SearchQueryBuilder ,ISort} from "@pnp/sp/presets/all";
import "@pnp/sp/webs";

const sp = spfi().using(SPBrowser({ baseUrl: (window as any)._spPageContextInfo.webAbsoluteUrl }));


function parseUserFormattedString(ownerString) {
  const owners = ownerString.split(";")
    .map( (owner) => {
        const parts = owner.trim().split("|");
        const oidstr = parts.splice(2,3).join("").trim();
        const oids = oidstr.split(" ");
        return {
            email: parts[0].trim(), displayName: parts[1].trim(), oid: oids[0].trim(), loginName: oids[1].trim(),
        };
    });
  return owners;
}

// wrapping the code inside self-excecuting async function
// enables you to use await expression
(async () => {

  



  const web = await sp.web.select("Title")()
  console.log("Web Title: ", web.Title);

  // AND (PKCIShowInSpotlight=True)
  // AND (PKCINewsCategory="Corporate") 
  // AND (PKCINewsCategory="Corporate and Democratic Services") 
  // AND (PKCINewsContentStatus=Active)
  const query: SearchQueryInit = {

    Querytext: "*",
    QueryTemplate: "({searchTerms}) ((PromotedState=2) ",
    SelectProperties: [
      
      "Title",
      "Path",
      "Created",
      "Filename",
      "SiteLogo",
      "PreviewUrl",
      "PictureThumbnailURL",
      "ServerRedirectedPreviewURL",
      "ServerRedirectedURL",
      "HitHighlightedSummary",
      "FileType",
      "contentclass",
      "ServerRedirectedEmbedURL",
      "DefaultEncodingURL",
      "owstaxidmetadataalltagsinfo",
      "Author",
      "AuthorOWSUSER",
      "SPSiteUrl",
      "SiteTitle",
      "UniqueID",
      "ParentLink",
      "SPWebUrl",
      "IsContainer",
      "IsListItem",
      "HtmlFileType",
      "OriginalPath",
      "FileExtension",
      "IsDocument",
      "NormSiteID",
      "NormWebID",
      "NormListID",
      "NormUniqueID",
      "SiteId",
      "WebId",
      "ContentTypeId",
      "PromotedStateOWSNMBR",
      "PromotedState",
      "Description",
      "ContentType",
      "EditorOwsUser",
      "ModifiedBy",
      "LastModifiedBy",
      "SiteName",
      "LastModifiedTime",
      "ListID",
      "ListItemID",
      "UserName",
      "ProfileImageSrc",
      "Name",
      "Initials",
      "WebPath",
      "IconUrl",
      "AccentColor",
      "CardType",
      "TipActionLabel",
      "TipActionButtonIcon",
      "ClassName",
      "IsExternalContent"
    ],
    Properties: [
      {
        Name: "TrimSelectProperties",
        Value: {
          StrVal: "1",
          QueryPropertyValueTypeIndex: 1
        }
      },
      {
        Name: "EnableDynamicGroups",
        Value: {
          BoolVal: false,
          QueryPropertyValueTypeIndex: 3
        }
      },
      {
        Name: "EnableMultiGeoSearch",
        Value: {
          BoolVal: false,
          QueryPropertyValueTypeIndex: 3
        }
      }
    ],
    TrimDuplicates: false,
    StartRow: 0,
    RowLimit: 50,
    RowsPerPage: 50,
    SortList: [
      {
        "Property": "LastModifiedTime",
        "Direction": 1
      }
    ]
  };
  const sortList : ISort = {Property:"LastModifiedTime",Direction:1}
 const builder = SearchQueryBuilder("card PromotedState:2").rowLimit(10).sortList(sortList)
 // const results = await sp.search(query);
   const results = await sp.search(builder);
  console.log("News search results: ", results);
  console.log("News search results: ", JSON.stringify(JSON.parse(JSON.stringify(results.PrimarySearchResults))));

  // results.PrimarySearchResults.forEach( (item: ISearchResult) => {
   
  //   console.log(item);

  // });




})().catch(console.log)

 */