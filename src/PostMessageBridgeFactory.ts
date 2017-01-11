import {
	Inject,
	Injectable,
	NgZone
} from '@angular/core';

import {IPostMessageBridge} from "./IPostMessageBridge";
import {PostMessageBridgeImpl} from "./PostMessageBridgeImpl";

@Injectable()
export class PostMessageBridgeFactory {

	constructor(@Inject(NgZone) private ngZone: NgZone) {
	}

	public makeInstance(): IPostMessageBridge {
		return new PostMessageBridgeImpl(this.ngZone);
	}
}
