import * as React from 'react';

export async function getToken(): Promise<string> {
    const { context } = await (window as any).moduleLoaderPromise
    const p = await context.aadTokenProviderFactory.getTokenProvider()

    const token = await p.getToken("https://graph.microsoft.com")
    return token
}



export interface IListItemViewer {
    showLeftBar? : boolean
}



function isInFrame() {
    return (window.top !== window);
}


export const ItemView = (props: IListItemViewer): JSX.Element => {
   const {showLeftBar} = props
    // "disabled" and checked in - will continue in branch
    const magicbuttonComms = !showLeftBar ? <div></div> : <div id="MAGICBUTTONLISTVIEW" style={{ position: "absolute" }}>
        <div style={{ position: "fixed", left: "0px", top: "0px", width: "64px", height: "100vh" }}>
            <div style={{ display: "flex" }} >
                <div style={{ flexGrow: "1" }} />

fdsfdsfds
            </div>

        </div>
    </div>

    return (
        <div>
            {magicbuttonComms}
        </div>
    )
}



/**
 * 
 * let xxx = document.getElementById("MAGICBUTTONTOOLBAR");xxx.appendChild(Array.from(document.querySelectorAll('[data-automation-id="LanguageSelector"]'))[0])

 */