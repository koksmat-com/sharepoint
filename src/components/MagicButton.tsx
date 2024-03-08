import * as React from 'react';
//import styles from './TopNav.module.scss';

import { useState, useEffect } from 'react';
import { NavigationNode } from '../helpers';
import { BreadCrumb } from './BreadCrumb';
import { SubNavigation } from './SubNavigation';
import { TopNode, TopNodeRight } from './TopNode';
import {
    PageContext
} from '@microsoft/sp-page-context';
import "@pnp/sp/site-users/web";

import NexiTopNavApplicationCustomizer, { NexiNavConfig } from '../extensions/nexiTopNav/NexiTopNavApplicationCustomizer';
import { ISPEventObserver } from '@microsoft/sp-core-library';
import { SPFI, containsInvalidFileFolderChars } from '@pnp/sp';
import { SPHttpClient } from "@microsoft/sp-http"
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { useBoolean } from '@uifabric/react-hooks';
import { set } from '@microsoft/sp-lodash-subset';
import { FaUserCog } from "react-icons/fa"
import { MdGTranslate, MdOpenInFull } from "react-icons/md"
import { ContentType } from '@pnp/sp/content-types';
import { CgInfinity } from "react-icons/cg"
import * as tags from "language-tags"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
export async function getToken(): Promise<string> {
    const { context } = await (window as any).moduleLoaderPromise
    const p = await context.aadTokenProviderFactory.getTokenProvider()

    const token = await p.getToken("https://graph.microsoft.com")
    return token
}



export interface ITopNavigation {
    onOver?: (node: NavigationNode) => void;
    onOut?: (node: NavigationNode) => void;
    setIsVisible: (visible:boolean) => void;
    applicationContext: NexiTopNavApplicationCustomizer,
    left: NavigationNode[];
    right: NavigationNode[];
    sp: SPFI;
    hubConfig: NexiNavConfig;
    homeUrl: string;
    magicboxUrl: string;
    logoUrl : string
}

class Observer implements ISPEventObserver {


    public get instanceId(): string {
        return "magicbox"
    }

    public get componentId(): string {
        return "magicbox"
    }

    isDisposed: boolean;
    dispose(): void {
        // throw new Error('Method not implemented.');
    }

}

function isInFrame() {
    return (window.top !== window);
}

const SiteTitle = (props: { show: boolean, Title: string, Url: string }) => {

    if (!props.show) return null;
    return (
        <TopNodeRight Title={props.Title} Url={props.Url} isSelected={true} fontsize='14px' />
    )

}
export interface PageTranslations {
    UntranslatedLanguages: string[]
    Items: Item[]
}

export interface Item {
    Culture: string
    FileStatus: number
    HasPublishedVersion: boolean
    LastModified: string
    Path: Path
    Title: string,
    SortOrder: number
}

export interface Path {
    DecodedUrl: string
}

export interface ItemInfo {
    Row: Row[]
    FirstRow: number
    FolderPermissions: string
    LastRow: number
    RowLimit: number
    FilterLink: string
    ForceNoHierarchy: string
    HierarchyHasIndention: string
    CurrentFolderSpItemUrl: string
}

export interface Row {
    ID: string
    PermMask: string
    FSObjType: string
    HTML_x0020_File_x0020_Type: string
    UniqueId: string
    ProgId: string
    NoExecute: string
    ContentType: string
    WelcomeViewId: string
    WelcomePageCustomized: string
    ContentTypeId: string
    FileRef: string
    _UIVersion: string
    SMTotalSize: string
    File_x0020_Size: string
    _CommentFlags: string
    _SPIsTranslation: string
    "_SPIsTranslation.value": string
    _SPTranslatedLanguages: string
    _SPTranslationSourceItemId: string
    ItemChildCount: string
    FolderChildCount: string
    A2ODMountCount: string
    _StubFile: string
    _ComplianceTag: string
    _ExpirationDate: string
    "_ExpirationDate.": string
    owshiddenversion: string
    _SPSitePageFlags: string
    ContentVersion: string
    DocConcurrencyNumber: string
    _VirusStatus: string
    Restricted: string
}


export const MagicButton = (props: ITopNavigation): JSX.Element => {
    const [isVisible, setIsVisible] = useState(true)
    const [selectedNavigationNode, setselectedNavigationNode] = useState(null)
    const [showLevel2, setShowLevel2] = useState(false)
    const [showSubNav, setshowSubNav] = useState(true)

    const [observer] = useState<Observer>(new Observer())
    const [token, setToken] = useState("")
    const [pageContext, setPageContext] = useState<PageContext>(null)
    const [showMagicbox, setshowMagicbox] = useState(false)
    const [message, setmessage] = useState("")

    const [isDesktopWidth, setisDesktopWidth] = useState(true)

    const [translatedPageUrl, settranslatedPageUrl] = useState("")

    const [translations, settranslations] = useState<Item[]>([])


    const [showtool, setshowtool] = useState<ToolProps | null>(null)
    const [showLeftBar, setshowLeftBar] = useState(false)
    const [showtranslatations, setshowtranslatations] = useState(false)
    const pageContextChanged = () => {
        console.log("pageContextChanged")
        setPageContext(props.applicationContext.ctx.pageContext)
        setShowLevel2(false)
        setshowSubNav(true)
        const more = async () => {
            const c = props.applicationContext.ctx.pageContext

            const pageId = (c.listItem as any).uniqueId
            // https://www.eliostruyf.com/multilingual-apis-modern-sharepoint/


            const listId = props.applicationContext.ctx.pageContext.list.id;
            const itemId = props.applicationContext.ctx.pageContext.listItem.id;

            const restAPI = `${props.applicationContext.ctx.pageContext.web.absoluteUrl}/_api/web/Lists(guid'${listId}')/RenderListDataAsStream`;
            const responseData = await props.applicationContext.ctx.spHttpClient.post(restAPI, SPHttpClient.configurations.v1, {
                body: JSON.stringify({
                    parameters: {
                        RenderOptions: 2,
                        ViewXml: `<View Scope="RecursiveAll">
                              <ViewFields>
                                <FieldRef Name="_SPIsTranslation"/>
                                <FieldRef Name="_SPTranslatedLanguages"/>
                                <FieldRef Name="_SPTranslatedLanguages"/>
                                <FieldRef Name="_SPTranslationSourceItemId"/>
                              </ViewFields>
                              <Query>
                                <Where>
                                  <Eq>
                                    <FieldRef Name="ID"/>
                                    <Value Type="Number">${itemId}</Value>
                                  </Eq>
                                </Where>
                              </Query>
                              <RowLimit />
                            </View>`
                    }
                })
            })


            const data: ItemInfo = await responseData.json()


            //console.log(data.Row[0]._SPTranslationSourceItemId)
            // debugger
            const masterpageId = (data.FirstRow === 1) && (data.Row[0]._SPTranslationSourceItemId) ? data.Row[0]._SPTranslationSourceItemId : pageId

            const absoluteUrl = c.web.absoluteUrl
            const x = await props.applicationContext.ctx.spHttpClient.get(`${absoluteUrl}/_api/sitepages/pages/GetTranslations('${masterpageId}')`, SPHttpClient.configurations.v1,
                {
                    headers: [
                        ['accept', 'application/json;odata.metadata=none']
                    ]
                })
            const trans: PageTranslations = await x.json()
        
            const translations = trans?.Items?.filter(i => i.HasPublishedVersion).map(i => i)

                if (!translations) return

            settranslations(translations.map(t => {
                return {
                    ...t, SortOrder: getLanguageName(t.Culture).order, Title: getLanguageName(t.Culture).name, Path: { DecodedUrl: absoluteUrl + "/" + t.Path.DecodedUrl }
                }
            }).sort((a, b) => a.SortOrder - b.SortOrder))

        }
        more()
    }
    type MessageTypes = "ensureuser" | "closemagicbox" | "resolveduser" | "context" | "capabilities" | "keep-standardnavigation" | "showtool" | "hidetool" | "eval"
    interface Message {
        type: "ensureuser" | "closemagicbox" | "getcontext"
        messageId: string
        str1: string
    }
    type openInOptions = "Same page" | "New page" | "Popup"
    interface ToolProps {
        link: string
        displayName: string
        openIn: openInOptions
        iconUrl: string
    }
    // This hook is listening an event that came from the Iframe



    function getLanguageName(code: string) {
        const lang = [

            { code: "hr-hr", name: "Croatian", order: 10 },
            { code: "cs-cz", name: "Czech", order: 10 },
            { code: "da-dk", name: "Danish", order: 20 },
            { code: "nl-nl", name: "Dutch", order: 30 },
            { code: "en-us", name: "English", order: 32 },
            { code: "fi-fi", name: "Finnish", order: 35 },
            { code: "fr-fr", name: "French", order: 40 },
            { code: "de-de", name: "German", order: 50 },
            { code: "el-gr", name: "Greek", order: 60 },
            { code: "it-it", name: "Italian", order: 65 },
            { code: "nb-no", name: "Norwegian", order: 66 },
            { code: "pt-br", name: "Portuguese", order: 70 },
            { code: "pl-pl", name: "Polish", order: 80 },

            { code: "es-es", name: "Spanish", order: 90 },
            { code: "sv-se", name: "Swedish", order: 100 },


            { code: "sk-sk", name: "Slovak", order: 85 },

            { code: "sl-si", name: "Slovene", order: 87 },


          








        ]

        return lang.find(l => l.code === code) ?? { code, name: code, order: 999 }

    }
    useEffect(() => {
        const keepStandardNavigation = localStorage.getItem("standardnavigation") === "true"
        const showLeftBarValue = localStorage.getItem("showleftbar") === "true"
        const showTranslationsValue = localStorage.getItem("showtranslations") === "true"

        setshowLeftBar(showLeftBarValue)
        setshowtranslatations(true)
        //setIsVisible(false)
        props.setIsVisible(keepStandardNavigation)
        setIsVisible(!keepStandardNavigation)
        const handler = async (ev: MessageEvent<{ type: MessageTypes, data: any }>) => {
            console.log('ev', ev)

            // if (typeof ev.data !== 'object') return
            // if (!ev.data.type) return
            // if (ev.data.type !== 'button-click') return
            //if (!ev.data) return
            //return "OK"
            let r
            try {


                const b = {
                    appCodeName: navigator.appCodeName,
                    appName: navigator.appName,
                    appVersion: navigator.appVersion,
                    cookieEnabled: navigator.cookieEnabled,
                    language: navigator.language,
                    platform: navigator.platform,
                    userAgent: navigator.userAgent,
                    vendor: navigator.vendor,
                    vendorSub: navigator.vendorSub,
                    product: navigator.product,
                    productSub: navigator.productSub,
                    maxTouchPoints: navigator.maxTouchPoints,
                    hardwareConcurrency: navigator.hardwareConcurrency,
                    doNotTrack: navigator.doNotTrack,
                    plugins: navigator.plugins,
                    mimeTypes: navigator.mimeTypes
                }
                const m = ev.data
                switch (m.type) {
                    case "ensureuser":
                        r = await props.sp.web.ensureUser(m.data)
                        console.log("ensureUser", m.data, r)
                        ev.source.postMessage({ "type": "resolveduser", data: r.data }, { targetOrigin: "*" });
                        break;
                    case "keep-standardnavigation":
                        localStorage.setItem("standardnavigation", m.data)
                        break
                    case "eval":

                        try {
                            eval(m.data)
                        } catch (error) {
                            console.log(error)
                        }
                        break
                    case "closemagicbox":
                        props.setIsVisible(false)
                        setIsVisible(false)
                        break
                    case "hidetool":
                        setshowtool(null)
                        break
                    case "showtool":
                        const toolData: ToolProps = m.data
                        switch (toolData.openIn) {
                            case "New page":
                                window.open(toolData.link, "_blank")
                                break;
                            case "Same page":
                                document.location.href = toolData.link
                                break
                            case "Popup":
                                setshowtool(toolData)
                                break

                        }

                        break
                    case "context":

                        const ctx = props.applicationContext.ctx.pageContext.legacyPageContext ?? {}
                        const data = JSON.stringify(ctx)

                        ev.source.postMessage({ "type": "context", data }, { targetOrigin: "*" });
                        const keepstandardnavigation = localStorage.getItem("standardnavigation")
                        ev.source.postMessage({ "type": "capabilities", data: { canKeepHidden: keepstandardnavigation } }, { targetOrigin: "*" });
                        break;
                    default:
                        break;
                }
                //setmessage(ev.data.message)

            } catch (error) {
                console.log("ERROR", error)
            }

        }
        const popstateHandler = async (ev: MessageEvent<{ type: MessageTypes, data: any }>) => {
            console.log('popstate ev', ev)
        }

        window.addEventListener('message', handler)
        window.addEventListener('popstate', popstateHandler);
        const mobile = window.innerWidth < 1024
        if (mobile) {
            setisDesktopWidth(false)
        }


        // Don't forget to remove addEventListener
        return () => {
            window.removeEventListener('message', handler)
            window.removeEventListener('popstate', popstateHandler)

        }
    }, [])
    useEffect(() => {
        if (observer) {

            props.applicationContext.ctx.application.navigatedEvent.add(observer, pageContextChanged)
        }
        return () => {
            if (observer) {
                props.applicationContext.ctx.application.navigatedEvent.remove(observer, pageContextChanged)
            }
        }
    }, [observer])
    useEffect(() => {
        const load = async () => {
            setToken((await getToken()))
        }
        load().then(() => { console.log("") }).catch((e) => { console.log(e) })
        var pageChrome: any = document.querySelector(".SPPageChrome");
        var suppressHack = true

        var editMode = document.location.href.indexOf("Mode=Edit") === -1 ? false : true
        if (pageChrome && !editMode) {
            pageChrome.style.height = "10000px";
            setTimeout(() => {
                var pageChrome: any = document.querySelector(".SPPageChrome");
                pageChrome.style.height = "100%";
            }, 2000)

        }


    }, [])

    useEffect(() => {
        try {



            const hubNav: HTMLElement = document.getElementsByClassName("ms-HubNav")[0] as HTMLElement
            if (hubNav) hubNav.style.display = (isVisible && isDesktopWidth) ? "none" : "flex"
            const horizontalNav: HTMLElement = document.getElementsByClassName("ms-HorizontalNav")[0] as HTMLElement
            if (horizontalNav) horizontalNav.style.display = (isVisible && isDesktopWidth) ? "none" : "flex"
            const appBar: HTMLElement = document.getElementsByClassName("sp-appBar")[0] as HTMLElement
            if (appBar) appBar.style.display = (isVisible && isDesktopWidth) ? "none" : "block"
            const article: HTMLElement = document.getElementsByTagName("article")[0] as HTMLElement
            if (article) article.style.marginTop = (isVisible && isDesktopWidth) ? "70px" : "0px"
            const spSiteHeader: HTMLElement = document.getElementById("spSiteHeader") as HTMLElement
            if (spSiteHeader) spSiteHeader.style.display = (isVisible && isDesktopWidth) ? "none" : "block"

            const commandBarWrapper: HTMLElement = document.getElementsByClassName("commandBarWrapper")[0] as HTMLElement
            if (commandBarWrapper) {
                console.log("Wrapper", commandBarWrapper.style.display);
                commandBarWrapper.style.display = (isVisible && isDesktopWidth) ? "none" : ""
            }
            const spPageChromeAppDiv: HTMLElement = document.getElementById("spPageChromeAppDiv")
            if (spPageChromeAppDiv) {
                spPageChromeAppDiv.style.marginLeft = ((showLeftBar) ? "64px" : "0px")
            }
        }
        catch (e) {
            console.log(e)
        }

    }, [isVisible, isDesktopWidth, showLeftBar])
    const onMouseOver = (node: NavigationNode): void => {
        setselectedNavigationNode(node)
        setShowLevel2(true)

    }
    const onMouseOverHubNav = (node: NavigationNode): void => {
        setselectedNavigationNode(node)
        setShowLevel2(true)
        setshowSubNav(false)
    }


    if (!isDesktopWidth) {
        return <div></div>
    }


    if (isInFrame()) {
        let article: HTMLElement = document.querySelector("article")
        if (article) {
            article.style.marginTop = "-20px"
        }
        return <div style={{
            position: "fixed",
            top: "0px",
            zIndex: "1000012",
            right: "0px",
            fontSize: "14px",
            color: "#242424",
            fontFamily: "Segoe UI Web (West European)"
        }}



        ><a href="#" target="_top"><MdOpenInFull /></a></div>
    }

    // "disabled" and checked in - will continue in branch
    const magicbuttonComms = !showLeftBar ? <div></div> : <div id="MAGICBUTTONCOMMS" style={{ position: "absolute" }}>
        <div style={{ position: "fixed", left: "0px", top: "0px", width: "64px", height: "100vh" }}>
            <div style={{ display: "flex" }} >
                <div style={{ flexGrow: "1" }} />


            </div>

            <iframe src={`${props.magicboxUrl}/sso?mode=leftbar&token=` + token + "&href=" + encodeURI(window.location.toString())} style={{ backgroundColor: false ? "red" : "transparent", width: "100%", height: "100%", border: "0px" }} />
        </div>
    </div>

    const navigateTranslation = (translations.length < 2 || !showtranslatations) ?  <div></div> : <div style={{ marginTop: "14px", fontSize: "14px", fontFamily: "'Ubuntu', sans-serif" }}>
        Language:&nbsp;{translations.map((t: Item, key) => {


            let isCurrent = t.Path.DecodedUrl.toLowerCase() === decodeURIComponent( window.location.href.toLowerCase().split("?")[0])
            if (!isCurrent &&  window.location.href.toLowerCase().indexOf("/sitepages/") === -1){

               if ( t.Culture === props.applicationContext.ctx.pageContext.cultureInfo.currentCultureName.toLowerCase()){
                isCurrent = true
               }
            }
            return (
                <a href={t.Path.DecodedUrl} key={key} style={{
                    textDecoration: "none", color: "#000000", borderBottom: isCurrent ? "2px solid #000000" : "2px solid #ffffffff", marginLeft: "2px", paddingRight: "2px", paddingLeft: "2px", fontSize: "14px", cursor: "pointer",
                    fontFamily: "'Ubuntu', sans-serif"
                }}> {t.Title}</a>


            )
        })}</div>

    if (!isVisible) return <div style={{
        position: 'fixed', top: "44px", right: "16px", backgroundColor: "#ffffff", zIndex: "10000000", cursor: "pointer", fontSize: "12px",
        fontFamily: "'Ubuntu', sans-serif"
    }} onClick={() => {
        props.setIsVisible(true)
        setIsVisible(true)
        setshowMagicbox(false)
        localStorage.setItem("standardnavigation", "false")
    }}>
        Turn on branding
        {magicbuttonComms}
    </div>
    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, width: "100vw", color: "#2D32AA", backgroundColor: "#ffffff", zIndex: "10000000",


            }}>

            <div
                style={{


                    boxShadow: "0px 1px 0px #EEEEEE, 0px 1px 30px rgba(145, 145, 145, 0.2)"
                }}
                onMouseLeave={() => {
                    console.log("level2 off")
                    setShowLevel2(false)
                    setshowSubNav(true)
                }}
            >
                <div

                    style={{ display: "flex", maxWidth: "1260px", marginLeft: "auto", marginRight: "auto", paddingTop: "20px", paddingBottom: "20px", width: "100vw", gap: "32px", height: "40px" }}>
                    <a href={props.homeUrl}><div style={{ padding: "8px", cursor: "pointer" }} >
                        {props.logoUrl && <img style={{height:"24px"}} src={props.logoUrl} />}
                        {!props.logoUrl &&
                        <svg width="79" height="24" viewBox="0 0 79 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M78.8184 0.678866H73.1374V23.321H78.8184V0.678866Z" fill="#2D32A9" />
                            <path d="M11.0838 0.0399332C5.64124 0.0399332 0 1.95673 0 1.95673V23.321H5.89946V5.95006C5.89946 5.95006 8.00499 5.07153 11.0838 5.07153C14.8976 5.07153 16.4867 7.16802 16.4867 10.4026C16.4867 10.802 16.4867 23.341 16.4867 23.341H22.3067C22.3067 23.0215 22.3067 10.7221 22.3067 10.4026C22.2869 3.39433 19.069 0.0399332 11.0838 0.0399332Z" fill="#2D32A9" />
                            <path d="M71.5086 0.678866H64.477L59.1535 7.30779L56.2336 3.61396C54.7637 1.75706 52.3999 0.678866 50.0362 0.678866H46.5799L55.4788 11.8801L46.282 23.3011H53.2541L58.9549 16.2528L62.2324 20.3859C63.7023 22.2229 66.066 23.3011 68.4099 23.3011H71.8264L62.6296 11.6805L71.5086 0.678866Z" fill="#2D32A9" />
                            <path d="M47.3149 18.9883L43.4614 15.8535C42.2497 17.2911 40.164 18.9883 36.7674 18.9883C34.1255 18.9883 31.7022 17.5107 30.5898 15.0748L47.8909 12.0199C47.8909 10.3228 47.5532 8.70545 46.9573 7.24789C45.1895 2.97503 41.1175 0 36.1715 0C29.5172 0 24.4321 4.75206 24.4321 11.9999C24.4321 18.9683 29.4179 23.9999 36.7872 23.9999C42.2696 24.0199 45.5868 21.1447 47.3149 18.9883ZM36.1715 4.89183C38.7338 4.89183 40.8592 6.08982 41.7332 8.14639L30.1329 10.203C30.7487 6.78866 33.1721 4.89183 36.1715 4.89183Z" fill="#2D32A9" />
                        </svg>}
                    </div></a>

                    <div style={{ display: "flex", flexGrow: "1" }}>
                        {/* <SiteTitle show={props?.hubConfig.showSiteTitle} Title={props?.hubConfig.siteTitle} Url={props?.hubConfig.siteUrl} /> */}

                        {props?.right.map((node: NavigationNode, index) => {
                            node.onOver = onMouseOverHubNav
                            // node.onOut = onMouseOut
                            return <TopNode key={index} {...node} fontsize="14px" />
                        })}
                        <div style={{ flexGrow: 1 }}></div>
                        {(props.hubConfig.showSearch) &&
                            <form style={{ display: "flex", padding: "6px" }} action="https://www.bing.com/work">
                                <input type="text" id="q" name="q" autoFocus style={{ border: "1px", borderColor: "#888888" }} />
                                <input type="submit" value="Search" style={{ marginLeft: "10px", borderRadius: "20px", backgroundColor: "#2D32A9", color: "white", paddingLeft: "20px", paddingRight: "20px", border: "0px" }} />
                            </form>}







                        <div style={{ position: "fixed", top: "30px", right: "60px" }} >
                            <div id="MAGICBUTTONTOOLBAR">

                            </div>





                        </div>

                        <div title="Click to change your profile" style={{ position: "fixed", top: "30px", right: "34px", cursor: "pointer" }} onClick={() => {

                            window.open(`${props.magicboxUrl}/profile/router`)

                        }}>
                            <FaUserCog />
                        </div>
                        <div title="Click to get editor options" style={{ position: "fixed", top: "30px", right: "10px", cursor: "pointer" }} onClick={() => {

                            setshowMagicbox(!showMagicbox)

                        }}>
                            {/* <svg width="16" height="16" viewBox="0 0 213 213" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M55 0C24.6243 0 0 24.6243 0 55V158C0 188.376 24.6243 213 55 213H158C188.376 213 213 188.376 213 158V55C213 24.6243 188.376 0 158 0H55ZM125.635 87.3516L107 30L88.3653 87.3516H28.0623L76.8485 122.797L58.2138 180.148L107 144.703L155.786 180.148L137.152 122.797L185.938 87.3516H125.635Z" fill="#233862" />
                            </svg> */}

                             <svg style={{ marginTop: "0px", cursor: "pointer" }} width="16" height="16" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.80923 13.9936C8.80923 11.4878 10.8405 9.45651 13.3463 9.45651C15.8522 9.45651 17.8835 11.4878 17.8835 13.9936C17.8835 16.4995 15.8522 18.5307 13.3463 18.5307C10.8405 18.5307 8.80923 16.4995 8.80923 13.9936ZM13.3463 11.2714C11.8428 11.2714 10.6241 12.4901 10.6241 13.9936C10.6241 15.4971 11.8428 16.7159 13.3463 16.7159C14.8499 16.7159 16.0686 15.4971 16.0686 13.9936C16.0686 12.4901 14.8499 11.2714 13.3463 11.2714Z" fill="black" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2359 1.66372C11.3408 1.26509 11.7012 0.987244 12.1135 0.987244H14.478C14.8903 0.987244 15.2508 1.26529 15.3556 1.66412L15.994 4.09438L18.3383 5.05848L20.0162 3.62462C20.3763 3.31691 20.9124 3.3379 21.2474 3.67281L23.6672 6.0926C24.0008 6.42623 24.0231 6.95986 23.7184 7.32014L22.2905 9.00894L23.233 11.2849L25.6689 11.9043C26.0712 12.0066 26.3527 12.3687 26.3527 12.7838L26.3526 15.176C26.3526 15.5891 26.0735 15.9501 25.6737 16.0541L23.2239 16.6915L22.2801 18.9705L23.7177 20.6662C24.0231 21.0264 24.0011 21.5607 23.6672 21.8946L21.2474 24.3144C20.9065 24.6553 20.3587 24.6701 19.9999 24.3483L19.9327 24.2883C19.8891 24.2494 19.8261 24.1933 19.7488 24.1247C19.5941 23.9874 19.3825 23.8007 19.1548 23.6025C18.874 23.358 18.586 23.1115 18.3516 22.9181L16.0555 23.869L15.4359 26.3154C15.3339 26.718 14.9716 27 14.5562 27H12.1364C11.7209 27 11.3584 26.7177 11.2566 26.3148L10.639 23.869L8.40852 22.9514L6.66022 24.3762C6.29936 24.6703 5.77449 24.6436 5.44533 24.3144L3.02553 21.8946C2.68544 21.5546 2.66978 21.0082 2.98983 20.6492L4.4422 19.02L3.48775 16.7558L1.00841 16.0789C0.613733 15.9712 0.339966 15.6126 0.339966 15.2035V12.7837C0.339966 12.362 0.630484 11.9959 1.04115 11.9001L3.45426 11.3369L4.38276 9.05405L2.9629 7.30645C2.66969 6.94555 2.69673 6.42141 3.02553 6.0926L5.44533 3.67281C5.78514 3.333 6.33095 3.31705 6.69003 3.63642L8.32432 5.09001L10.585 4.13705L11.2359 1.66372ZM12.813 2.80209L12.2265 5.03072C12.1548 5.303 11.9608 5.52659 11.7014 5.63595L8.5016 6.98478C8.17924 7.12067 7.80746 7.05914 7.54606 6.82664L6.12342 5.5613L4.8875 6.79721L6.12988 8.32637C6.33869 8.58338 6.39092 8.93372 6.26616 9.24045L4.95842 12.4557C4.84744 12.7285 4.61094 12.9305 4.3241 12.9975L2.15481 13.5038V14.5106L4.39146 15.1212C4.66024 15.1946 4.88042 15.3874 4.98865 15.6441L6.33724 18.8433C6.47328 19.166 6.41147 19.5382 6.17843 19.7996L4.9147 21.2172L6.14907 22.4516L7.68084 21.2033C7.93891 20.993 8.29143 20.9409 8.59931 21.0675L11.7521 22.3645C12.018 22.4739 12.2163 22.7028 12.2867 22.9815L12.8432 25.1852H13.85L14.408 22.982C14.4783 22.7043 14.6757 22.4761 14.9404 22.3664L18.1474 21.0383C18.4367 20.9185 18.7675 20.9563 19.0223 21.1385C19.3324 21.3602 19.896 21.8416 20.3464 22.2336C20.4226 22.2999 20.4969 22.3649 20.568 22.4272L21.7929 21.2023L20.5377 19.7217C20.3179 19.4624 20.2614 19.1019 20.3915 18.7878L21.72 15.5798C21.8288 15.317 22.0546 15.1205 22.3299 15.0489L24.5378 14.4744L24.5378 13.4893L22.345 12.9317C22.0676 12.8611 21.8398 12.6639 21.7303 12.3994L20.4022 9.19247C20.2722 8.87873 20.3284 8.51869 20.5476 8.25938L21.7937 6.78571L20.5574 5.5494L19.0957 6.79851C18.8369 7.01972 18.476 7.0774 18.1611 6.9479L14.886 5.60103C14.6229 5.49283 14.4258 5.2675 14.3535 4.99235L13.7781 2.80209H12.813Z" fill="black" />
                            </svg>
                        </div>


                    </div>

                </div >
                {showSubNav &&
                    <div style={{ backgroundColor: "#eeeeee" }}>
                        <div style={{ display: "flex", maxWidth: "1260px", marginLeft: "auto", marginRight: "auto", paddingTop: "6px", paddingBottom: "6px", width: "100vw", gap: "32px", height: "40px" }}>
                            <div style={{ flexGrow: 1, display: "flex" }}>
                                {props?.left.length > 0 &&
                                    <div style={{ display: "flex" }}>
                                        <SiteTitle show={props?.hubConfig.showSiteTitle} Title={props?.hubConfig.siteTitle + " :"} Url={props?.hubConfig.siteUrl} />
                                        {props?.left.map((node: NavigationNode, index) => {
                                            node.onOver = onMouseOver
                                            // node.onOut = onMouseOut
                                            return <TopNode key={index} {...node} fontsize="14px" />
                                        })}
                                    </div>}
                            </div>
                            <div>
                                {navigateTranslation}

                            </div>
                        </div>
                    </div>}
                {showLevel2 &&
                    <div
                        style={{

                            width: "100%", gap: "32px", height: "auto", minHeight: "120px",
                            display: "flex", maxWidth: "1260px", marginLeft: "auto", marginRight: "auto",
                            backgroundColor: "#1E1E1E;"
                        }}>


                        <SubNavigation sp={props.sp} node={selectedNavigationNode} onNavigate={() => {

                            setShowLevel2(false);
                        }} level={2} selectParent={function (): void {
                            console.log("Select parent level 2");
                        }} /></div>}


            </div>
            {!showLevel2 && false &&
                <div

                    style={{ display: "flex", maxWidth: "1260px", marginLeft: "auto", marginRight: "auto", width: "100vw", marginTop: "20px", marginBottom: "20px", height: "28px" }}>

                    {pageContext && <BreadCrumb pageContext={pageContext} showHome={!props.hubConfig.hideHome} />}



                </div>
            }
            {/* 
Here is a panel which appear 100px under the top and is 300px wide
*/}
            {showMagicbox &&
                <div style={{ position: "absolute" }}>
                    <div style={{ position: "fixed", right: "0px", top: "80px", width: "100vw", height: "calc(100vh - 80px)" }}>
                        <div style={{ display: "flex" }} >
                            <div style={{ flexGrow: "1" }} />


                        </div>

                        <iframe src={`${props.magicboxUrl}/sso?token=` + token + "&href=" + encodeURI(window.location.toString())} style={{ backgroundColor: false ? "red" : "transparent", width: "100%", height: "100%", border: "0px" }} />
                    </div>
                </div>
            }
            {magicbuttonComms}
            {showtool &&
                <div style={{ position: "absolute" }}>
                    <div style={{ position: "fixed", right: "0px", top: "0px", width: "100vw", height: "100vh" }}>
                        <div style={{ display: "flex" }} >
                            <div style={{ flexGrow: "1" }} />


                        </div>

                        <iframe src={`${props.magicboxUrl}/sso?token=` + token + "&href=" + encodeURI(window.location.toString()) + "&tool=" + encodeURI(showtool.link)} style={{ backgroundColor: false ? "red" : "transparent", width: "100%", height: "100%", border: "0px" }} />
                    </div>
                </div>
            }
        </div>
    )
}



/**
 * 
 * let xxx = document.getElementById("MAGICBUTTONTOOLBAR");xxx.appendChild(Array.from(document.querySelectorAll('[data-automation-id="LanguageSelector"]'))[0])

 */