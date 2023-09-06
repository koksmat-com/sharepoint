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
import { SPFI } from '@pnp/sp';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { useBoolean } from '@uifabric/react-hooks';
import { set } from '@microsoft/sp-lodash-subset';
import {FaUserCog} from "react-icons/fa"

export async function getToken(): Promise<string> {
    const { context } = await (window as any).moduleLoaderPromise
    const p = await context.aadTokenProviderFactory.getTokenProvider()
    const token = await p.getToken("https://graph.microsoft.com")
    return token
}



export interface ITopNavigation {
    onOver?: (node: NavigationNode) => void;
    onOut?: (node: NavigationNode) => void;

    applicationContext: NexiTopNavApplicationCustomizer,
    left: NavigationNode[];
    right: NavigationNode[];
    sp: SPFI;
    hubConfig: NexiNavConfig;
    homeUrl: string;
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
        <TopNodeRight Title={props.Title} Url={props.Url} isSelected={true} />
    )

}

export const TopNavigation = (props: ITopNavigation): JSX.Element => {
    const [isVisible, setIsVisible] = useState(true)
    const [selectedNavigationNode, setselectedNavigationNode] = useState(null)
    const [showLevel2, setShowLevel2] = useState(false)
    const [showSubNav, setshowSubNav] = useState(true)
  
    const [observer] = useState<Observer>(new Observer())
    const [token, setToken] = useState("")
    const [pageContext, setPageContext] = useState<PageContext>(null)
    const [showMagicbox, setshowMagicbox] = useState(false)
    const [message, setmessage] = useState("")


    const pageContextChanged = () => {
        console.log("pageContextChanged")
        setPageContext(props.applicationContext.ctx.pageContext)
        setShowLevel2(false)
        setshowSubNav(true)
    }
    type MessageTypes = "ensureuser" | "closemagicbox" | "resolveduser"
    interface Message {
        type: "ensureuser" | "closemagicbox"
        messageId: string
        str1: string
    }
    // This hook is listening an event that came from the Iframe
    useEffect(() => {
        const handler = async (ev: MessageEvent<{ type: MessageTypes, data: any }>) => {
            console.log('ev', ev)

            // if (typeof ev.data !== 'object') return
            // if (!ev.data.type) return
            // if (ev.data.type !== 'button-click') return
            //if (!ev.data) return
            //return "OK"
            let r
            try {
                const m = ev.data
                switch (m.type) {
                    case "ensureuser":
                        r = await props.sp.web.ensureUser(m.data)
                        console.log("ensureUser", m.data, r)
                        ev.source.postMessage({ "type": "resolveduser", data: r.data }, { targetOrigin: "*" });
                        break;
                    case "closemagicbox":
                        setIsVisible(false)
                        break
                    default:
                        break;
                }
                //setmessage(ev.data.message)

            } catch (error) {
                console.log("ERROR", error)
            }

        }

        window.addEventListener('message', handler)

        // Don't forget to remove addEventListener
        return () => window.removeEventListener('message', handler)
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
    }, [])

    useEffect(() => {
        try {



            const hubNav: HTMLElement = document.getElementsByClassName("ms-HubNav")[0] as HTMLElement
            if (hubNav) hubNav.style.display = isVisible ? "none" : "flex"
            const appBar: HTMLElement = document.getElementsByClassName("sp-appBar")[0] as HTMLElement
            if (appBar) appBar.style.display = isVisible ? "none" : "block"
            const article: HTMLElement = document.getElementsByTagName("article")[0] as HTMLElement
            if (article) article.style.marginTop = isVisible ? "70px" : "0px"
            const spSiteHeader: HTMLElement = document.getElementById("spSiteHeader") as HTMLElement
            if (spSiteHeader) spSiteHeader.style.display = isVisible ? "none" : "block"

            const commandBarWrapper: HTMLElement = document.getElementsByClassName("commandBarWrapper")[0] as HTMLElement
            if (commandBarWrapper) {
                console.log("Wrapper", commandBarWrapper.style.display);
                commandBarWrapper.style.display = isVisible ? "none" : ""
            }
        }
        catch (e) {
            console.log(e)
        }

    }, [isVisible])
    const onMouseOver = (node: NavigationNode): void => {
        setselectedNavigationNode(node)
        setShowLevel2(true)
       
    }
    const onMouseOverHubNav = (node: NavigationNode): void => {
        setselectedNavigationNode(node)
        setShowLevel2(true)
        setshowSubNav(false)
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



        ><a href="#" target="_top">Full screen</a></div>
    }


    if (!isVisible) return <div style={{
        position: 'fixed', top: "44px", right: "16px", backgroundColor: "#ffffff", zIndex: "10000000", cursor: "pointer", fontSize: "12px",
        fontFamily: "'Ubuntu', sans-serif"
    }} onClick={() => { setIsVisible(true), setshowMagicbox(false) }}>
        Turn on Nexi branding
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
                        <svg width="79" height="24" viewBox="0 0 79 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M78.8184 0.678866H73.1374V23.321H78.8184V0.678866Z" fill="#2D32A9" />
                            <path d="M11.0838 0.0399332C5.64124 0.0399332 0 1.95673 0 1.95673V23.321H5.89946V5.95006C5.89946 5.95006 8.00499 5.07153 11.0838 5.07153C14.8976 5.07153 16.4867 7.16802 16.4867 10.4026C16.4867 10.802 16.4867 23.341 16.4867 23.341H22.3067C22.3067 23.0215 22.3067 10.7221 22.3067 10.4026C22.2869 3.39433 19.069 0.0399332 11.0838 0.0399332Z" fill="#2D32A9" />
                            <path d="M71.5086 0.678866H64.477L59.1535 7.30779L56.2336 3.61396C54.7637 1.75706 52.3999 0.678866 50.0362 0.678866H46.5799L55.4788 11.8801L46.282 23.3011H53.2541L58.9549 16.2528L62.2324 20.3859C63.7023 22.2229 66.066 23.3011 68.4099 23.3011H71.8264L62.6296 11.6805L71.5086 0.678866Z" fill="#2D32A9" />
                            <path d="M47.3149 18.9883L43.4614 15.8535C42.2497 17.2911 40.164 18.9883 36.7674 18.9883C34.1255 18.9883 31.7022 17.5107 30.5898 15.0748L47.8909 12.0199C47.8909 10.3228 47.5532 8.70545 46.9573 7.24789C45.1895 2.97503 41.1175 0 36.1715 0C29.5172 0 24.4321 4.75206 24.4321 11.9999C24.4321 18.9683 29.4179 23.9999 36.7872 23.9999C42.2696 24.0199 45.5868 21.1447 47.3149 18.9883ZM36.1715 4.89183C38.7338 4.89183 40.8592 6.08982 41.7332 8.14639L30.1329 10.203C30.7487 6.78866 33.1721 4.89183 36.1715 4.89183Z" fill="#2D32A9" />
                        </svg>
                    </div></a>

                    <div style={{ display: "flex", flexGrow: "1" }}>
                        {/* <SiteTitle show={props?.hubConfig.showSiteTitle} Title={props?.hubConfig.siteTitle} Url={props?.hubConfig.siteUrl} /> */}

                        {props?.right.map((node: NavigationNode,index) => {
                        node.onOver = onMouseOverHubNav
                        // node.onOut = onMouseOut
                        return <TopNode key={index} {...node} />
                        })}
                         <div style={{ flexGrow: 1 }}></div>
                        {(true || props.hubConfig.showSearch) &&
                            <form style={{ display: "flex" ,padding:"6px"}} action="https://www.office.com/search">
                                <input type="text" id="q" name="q" autoFocus style={{border:"1px",borderColor:"#888888"}} />
                                <input type="submit" value="Search" style={{marginLeft:"10px",borderRadius:"20px",backgroundColor:"#2D32A9",color:"white",paddingLeft:"20px",paddingRight:"20px",border:"0px"}}/>
                            </form>}
                            <div title="Click to change your profile" style={{ position: "fixed", top: "30px", right: "34px",cursor: "pointer"  }} onClick={() => {

window.open("https://home.nexi-intra.com/profile/router")

}}>
<FaUserCog />
</div>
                        <div title="Click to get editor options" style={{ position: "fixed", top: "30px", right: "10px" }} onClick={() => {

                            setshowMagicbox(!showMagicbox)

                        }}>
                            <svg style={{ marginTop: "0px", cursor: "pointer" }} width="16" height="16" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.80923 13.9936C8.80923 11.4878 10.8405 9.45651 13.3463 9.45651C15.8522 9.45651 17.8835 11.4878 17.8835 13.9936C17.8835 16.4995 15.8522 18.5307 13.3463 18.5307C10.8405 18.5307 8.80923 16.4995 8.80923 13.9936ZM13.3463 11.2714C11.8428 11.2714 10.6241 12.4901 10.6241 13.9936C10.6241 15.4971 11.8428 16.7159 13.3463 16.7159C14.8499 16.7159 16.0686 15.4971 16.0686 13.9936C16.0686 12.4901 14.8499 11.2714 13.3463 11.2714Z" fill="black" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2359 1.66372C11.3408 1.26509 11.7012 0.987244 12.1135 0.987244H14.478C14.8903 0.987244 15.2508 1.26529 15.3556 1.66412L15.994 4.09438L18.3383 5.05848L20.0162 3.62462C20.3763 3.31691 20.9124 3.3379 21.2474 3.67281L23.6672 6.0926C24.0008 6.42623 24.0231 6.95986 23.7184 7.32014L22.2905 9.00894L23.233 11.2849L25.6689 11.9043C26.0712 12.0066 26.3527 12.3687 26.3527 12.7838L26.3526 15.176C26.3526 15.5891 26.0735 15.9501 25.6737 16.0541L23.2239 16.6915L22.2801 18.9705L23.7177 20.6662C24.0231 21.0264 24.0011 21.5607 23.6672 21.8946L21.2474 24.3144C20.9065 24.6553 20.3587 24.6701 19.9999 24.3483L19.9327 24.2883C19.8891 24.2494 19.8261 24.1933 19.7488 24.1247C19.5941 23.9874 19.3825 23.8007 19.1548 23.6025C18.874 23.358 18.586 23.1115 18.3516 22.9181L16.0555 23.869L15.4359 26.3154C15.3339 26.718 14.9716 27 14.5562 27H12.1364C11.7209 27 11.3584 26.7177 11.2566 26.3148L10.639 23.869L8.40852 22.9514L6.66022 24.3762C6.29936 24.6703 5.77449 24.6436 5.44533 24.3144L3.02553 21.8946C2.68544 21.5546 2.66978 21.0082 2.98983 20.6492L4.4422 19.02L3.48775 16.7558L1.00841 16.0789C0.613733 15.9712 0.339966 15.6126 0.339966 15.2035V12.7837C0.339966 12.362 0.630484 11.9959 1.04115 11.9001L3.45426 11.3369L4.38276 9.05405L2.9629 7.30645C2.66969 6.94555 2.69673 6.42141 3.02553 6.0926L5.44533 3.67281C5.78514 3.333 6.33095 3.31705 6.69003 3.63642L8.32432 5.09001L10.585 4.13705L11.2359 1.66372ZM12.813 2.80209L12.2265 5.03072C12.1548 5.303 11.9608 5.52659 11.7014 5.63595L8.5016 6.98478C8.17924 7.12067 7.80746 7.05914 7.54606 6.82664L6.12342 5.5613L4.8875 6.79721L6.12988 8.32637C6.33869 8.58338 6.39092 8.93372 6.26616 9.24045L4.95842 12.4557C4.84744 12.7285 4.61094 12.9305 4.3241 12.9975L2.15481 13.5038V14.5106L4.39146 15.1212C4.66024 15.1946 4.88042 15.3874 4.98865 15.6441L6.33724 18.8433C6.47328 19.166 6.41147 19.5382 6.17843 19.7996L4.9147 21.2172L6.14907 22.4516L7.68084 21.2033C7.93891 20.993 8.29143 20.9409 8.59931 21.0675L11.7521 22.3645C12.018 22.4739 12.2163 22.7028 12.2867 22.9815L12.8432 25.1852H13.85L14.408 22.982C14.4783 22.7043 14.6757 22.4761 14.9404 22.3664L18.1474 21.0383C18.4367 20.9185 18.7675 20.9563 19.0223 21.1385C19.3324 21.3602 19.896 21.8416 20.3464 22.2336C20.4226 22.2999 20.4969 22.3649 20.568 22.4272L21.7929 21.2023L20.5377 19.7217C20.3179 19.4624 20.2614 19.1019 20.3915 18.7878L21.72 15.5798C21.8288 15.317 22.0546 15.1205 22.3299 15.0489L24.5378 14.4744L24.5378 13.4893L22.345 12.9317C22.0676 12.8611 21.8398 12.6639 21.7303 12.3994L20.4022 9.19247C20.2722 8.87873 20.3284 8.51869 20.5476 8.25938L21.7937 6.78571L20.5574 5.5494L19.0957 6.79851C18.8369 7.01972 18.476 7.0774 18.1611 6.9479L14.886 5.60103C14.6229 5.49283 14.4258 5.2675 14.3535 4.99235L13.7781 2.80209H12.813Z" fill="black" />
                            </svg>
                        </div>


                    </div>

                </div >
                {showSubNav &&
                <div style={{backgroundColor: "#eeeeee"}}>
                    <div style={{ display: "flex", maxWidth: "1260px", marginLeft: "auto", marginRight: "auto", paddingTop: "6px", paddingBottom: "6px", width: "100vw", gap: "32px", height: "40px" }}>
                        <div style={{ flexGrow: 1, display: "flex" }}>
                        <SiteTitle show={props?.hubConfig.showSiteTitle} Title={props?.hubConfig.siteTitle +" :"} Url={props?.hubConfig.siteUrl} />
                            {props?.left.map((node: NavigationNode, index) => {
                                node.onOver = onMouseOver
                                // node.onOut = onMouseOut
                                return <TopNode key={index} {...node} />
                            })}
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


                        <SubNavigation sp={props.sp} node={selectedNavigationNode} onNavigate={() => { setShowLevel2(false); }} level={2} selectParent={function (): void {
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

                        <iframe src={"https://home.nexi-intra.com/magicbox?token=" + token + "&href=" + encodeURI(window.location.toString())} style={{ backgroundColor: "transparent", width: "100%", height: "100%", border: "0px" }} />
                    </div>
                </div>
            }

        </div>
    )
}
