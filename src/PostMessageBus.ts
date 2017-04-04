// TODO https://github.com/angular/angular/issues/13555

import {EventEmitter, Injectable, NgZone} from '@angular/core';

export interface PostMessageTarget {
	postMessage: (message: any, transfer?: [ArrayBuffer]) => void;
}

/**
 * Helper class that wraps a channel's {\@link EventEmitter} and
 * keeps track of if it should run in the zone.
 */
class _Channel {

	/**
	 * @param {?} emitter
	 * @param {?} runInZone
	 */
	constructor(public emitter, public runInZone) {
	}
}

/**
 * Message Bus is a low level API used to communicate between the UI and the background.
 * Communication is based on a channel abstraction. Messages published in a
 * given channel to one MessageBusSink are received on the same channel
 * by the corresponding MessageBusSource.
 *
 * @experimental WebWorker support in Angular is currenlty experimental.
 */
export abstract class MessageBus implements MessageBusSource, MessageBusSink {
	/**
	 * Sets up a new channel on the MessageBus.
	 * MUST be called before calling from or to on the channel.
	 * If runInZone is true then the source will emit events inside the angular zone
	 * and the sink will buffer messages and send only once the zone exits.
	 * if runInZone is false then the source will emit events inside the global zone
	 * and the sink will send messages immediately.
	 */
	abstract initChannel(channel: string, runInZone?: boolean): void;

	/**
	 * Assigns this bus to the given zone.
	 * Any callbacks attached to channels where runInZone was set to true on initialization
	 * will be executed in the given zone.
	 */
	abstract attachToZone(zone: NgZone): void;

	/**
	 * Returns an {@link EventEmitter} that emits every time a message
	 * is received on the given channel.
	 */
	abstract from(channel: string): EventEmitter<any>;


	/**
	 * Returns an {@link EventEmitter} for the given channel
	 * To publish methods to that channel just call next on the returned emitter
	 */
	abstract to(channel: string): EventEmitter<any>;
}

/**
 * @experimental WebWorker support in Angular is currenlty experimental.
 */
export interface MessageBusSource {
	/**
	 * Sets up a new channel on the MessageBusSource.
	 * MUST be called before calling from on the channel.
	 * If runInZone is true then the source will emit events inside the angular zone.
	 * if runInZone is false then the source will emit events inside the global zone.
	 */
	initChannel(channel: string, runInZone: boolean): void;

	/**
	 * Assigns this source to the given zone.
	 * Any channels which are initialized with runInZone set to true will emit events that will be
	 * executed within the given zone.
	 */
	attachToZone(zone: NgZone): void;

	/**
	 * Returns an {@link EventEmitter} that emits every time a message
	 * is received on the given channel.
	 */
	from(channel: string): EventEmitter<any>;
}

/**
 * @experimental WebWorker support in Angular is currenlty experimental.
 */
export interface MessageBusSink {
	/**
	 * Sets up a new channel on the MessageBusSink.
	 * MUST be called before calling to on the channel.
	 * If runInZone is true the sink will buffer messages and send only once the zone exits.
	 * if runInZone is false the sink will send messages immediatly.
	 */
	initChannel(channel: string, runInZone: boolean): void;

	/**
	 * Assigns this sink to the given zone.
	 * Any channels which are initialized with runInZone set to true will wait for the given zone
	 * to exit before sending messages.
	 */
	attachToZone(zone: NgZone): void;

	/**
	 * Returns an {@link EventEmitter} for the given channel
	 * To publish methods to that channel just call next on the returned emitter
	 */
	to(channel: string): EventEmitter<any>;
}

export class PostMessageBusSink implements MessageBusSink {
	private _zone: NgZone;
	private _channels: {[key: string]: _Channel} = {};
	private _messageBuffer: Array<Object> = [];

	constructor(private _postMessageTarget: PostMessageTarget) {}

	attachToZone(zone: NgZone): void {
		this._zone = zone;
		this._zone.runOutsideAngular(
			() => { this._zone.onStable.subscribe({next: () => { this._handleOnEventDone(); }}); });
	}

	initChannel(channel: string, runInZone: boolean = true): void {
		if (this._channels.hasOwnProperty(channel)) {
			throw new Error(`${channel} has already been initialized`);
		}

		const emitter = new EventEmitter(false);
		const channelInfo = new _Channel(emitter, runInZone);
		this._channels[channel] = channelInfo;
		emitter.subscribe((data: Object) => {
			const message = {channel: channel, message: data};
			if (runInZone) {
				this._messageBuffer.push(message);
			} else {
				this._sendMessages([message]);
			}
		});
	}

	to(channel: string): EventEmitter<any> {
		if (this._channels.hasOwnProperty(channel)) {
			return this._channels[channel].emitter;
		} else {
			throw new Error(`${channel} is not set up. Did you forget to call initChannel?`);
		}
	}

	private _handleOnEventDone() {
		if (this._messageBuffer.length > 0) {
			this._sendMessages(this._messageBuffer);
			this._messageBuffer = [];
		}
	}

	private _sendMessages(messages: Array<Object>) { this._postMessageTarget.postMessage(messages); }
}

export class PostMessageBusSource implements MessageBusSource {
	private _zone: NgZone;
	private _channels: {[key: string]: _Channel} = {};

	constructor(eventTarget?: EventTarget) {
		if (eventTarget) {
			eventTarget.addEventListener('message', (ev: MessageEvent) => this._handleMessages(ev));
		} else {
			// if no eventTarget is given we assume we're in a WebWorker and listen on the global scope
			const workerScope = <EventTarget>self;
			workerScope.addEventListener('message', (ev: MessageEvent) => this._handleMessages(ev));
		}
	}

	attachToZone(zone: NgZone) {
		this._zone = zone;
	}

	initChannel(channel: string, runInZone: boolean = true) {
		if (this._channels.hasOwnProperty(channel)) {
			throw new Error(`${channel} has already been initialized`);
		}

		const emitter = new EventEmitter(false);
		const channelInfo = new _Channel(emitter, runInZone);
		this._channels[channel] = channelInfo;
	}

	from(channel: string): EventEmitter<any> {
		if (this._channels.hasOwnProperty(channel)) {
			return this._channels[channel].emitter;
		} else {
			throw new Error(`${channel} is not set up. Did you forget to call initChannel?`);
		}
	}

	private _handleMessages(ev: MessageEvent): void {
		const messages = ev.data;
		for (let i = 0; i < messages.length; i++) {
			this._handleMessage(messages[i]);
		}
	}

	private _handleMessage(data: any): void {
		const channel = data.channel;
		if (this._channels.hasOwnProperty(channel)) {
			const channelInfo = this._channels[channel];
			if (channelInfo.runInZone) {
				this._zone.run(() => {
					channelInfo.emitter.emit(data.message);
				});
			} else {
				channelInfo.emitter.emit(data.message);
			}
		}
	}
}