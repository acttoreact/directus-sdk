/**
 * Activity handler
 */

import { WebSocketItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { DefaultType } from '../../types';
import { WebSocketCommentsHandler } from './comments';
import { ActivityItem } from '../../types';

export class WebSocketActivityHandler<T = DefaultType> extends WebSocketItemsHandler<ActivityItem<T>> {
	private _comments: WebSocketCommentsHandler<T>;

	constructor(transport: IWebSocketTransport) {
		super('directus_activity', transport);
		this._comments = new WebSocketCommentsHandler(this.transport);
	}

	get comments(): WebSocketCommentsHandler<T> {
		return this._comments;
	}
}
