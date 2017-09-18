import {IPostMessageEventTarget} from './IPostMessageEventTarget';

export interface IPostMessageBridge {

    /**
     * Connect the both points (window, iframe, etc..)
     *
     * @param source The first Window (Window/IFrame)
     * @param target The second Window (Window/IFrame)
     * @param targetOrigin The target origin or "*" as the default value (see https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
     */
    connect(source:IPostMessageEventTarget, target:IPostMessageEventTarget, targetOrigin?:string):IPostMessageBridge;

    /**
     * Make the bridge (aka Angular2 channel)
     *
     * @param bridgeName Bridge name
     */
    makeBridge(bridgeName:string):IPostMessageBridge;

    /**
     * Send message from the source to the target
     *
     * @param bridgeName Bridge name (aka Angular2 channel name)
     * @param message Message
     */
    sendMessage<T>(bridgeName:string, message?:T):IPostMessageBridge;

    /**
     * Add listener to bridge (aka Angular2 channel)
     *
     * @param bridgeName Bridge name (aka Angular2 channel name)
     * @param listener Callback
     */
    addListener(bridgeName:string, listener:Function):IPostMessageBridge;

    /**
     * Remove a listener
     *
     * @param bridgeName Bridge name (aka Angular2 channel name)
     * @param listener Callback
     */
    removeListener(bridgeName: string, listener: Function): IPostMessageBridge;

    /**
     * Remove the all listeners
     *
     * @param bridgeName Bridge name (aka Angular2 channel name)
     */
    removeAllListeners(bridgeName: string): IPostMessageBridge;

    /**
     * Enable or disable the smart logger (if you use the external logger).
     * By default, the smart logger is enabled
     *
     * @param enabled True - enable logging
     */
    setEnableLogging(enabled:boolean):IPostMessageBridge;
}
