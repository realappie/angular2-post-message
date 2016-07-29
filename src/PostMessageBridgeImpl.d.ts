import {Type} from '@angular/core';

import {IPostMessageBridge} from './IPostMessageBridge';
import {IPostMessageEventTarget} from './IPostMessageEventTarget';

export declare class PostMessageBridgeImpl implements IPostMessageBridge {
    public connect(source:IPostMessageEventTarget, target:IPostMessageEventTarget, targetOrigin?:string):IPostMessageBridge;

    public makeBridge(bridgeName:string):IPostMessageBridge;

    public sendMessage(bridgeName:string, message?:any):IPostMessageBridge;

    public addListener(bridgeName:string, listener:Type):IPostMessageBridge;
}
