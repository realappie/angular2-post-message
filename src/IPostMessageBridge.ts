import {Type} from '@angular/core';
import {IPostMessageEventTarget} from './IPostMessageEventTarget';

export interface IPostMessageBridge {

    /**
     * @param source The first Window (Window/IFrame)
     * @param target The second Window (Window/IFrame)
     * @param targetOrigin The target origin or "*" as the default value
     */
    connect(source:IPostMessageEventTarget, target:IPostMessageEventTarget, targetOrigin?:string):IPostMessageBridge;

    /**
     * Make the bridge
     *
     * @param bridgeName Bridge name
     */
    makeBridge(bridgeName:string):IPostMessageBridge;

    /**
     * Send message from the source to the target
     *
     * @param bridgeName Bridge name
     * @param message Message
     */
    sendMessage(bridgeName:string, message?:any):IPostMessageBridge;

    /**
     * Add listener to bridge
     *
     * @param bridgeName Bridge name
     * @param listener
     */
    addListener(bridgeName:string, listener:Type):IPostMessageBridge;
}
