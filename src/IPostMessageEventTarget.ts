export interface IPostMessageEventTarget extends EventTarget {
    postMessage(message:any, targetOrigin:string, ports?:any):void;
}
