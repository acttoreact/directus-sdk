/**
 * Activity handler
 */

import { ItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { ActivityType, DefaultType } from '../../types';
import { CommentsHandler } from './comments';

export type ActivityItem<T = DefaultType> = ActivityType & T;

export class ActivityHandler<T = DefaultType> extends ItemsHandler<ActivityItem<T>> {
	private _comments: CommentsHandler<T>;

	constructor(transport: IWebSocketTransport) {
		super('directus_activity', transport);
		this._comments = new CommentsHandler(this.transport);
	}

	get comments(): CommentsHandler<T> {
		return this._comments;
	}
}
