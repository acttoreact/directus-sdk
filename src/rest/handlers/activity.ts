/**
 * Activity handler
 */

import { ActivityItem } from '../../types';
import { DefaultType } from '../../types';
import { ItemsHandler } from '../base/items';
import { ITransport } from '../transport';
import { CommentsHandler } from './comments';

export class ActivityHandler<T = DefaultType> extends ItemsHandler<ActivityItem<T>> {
	private _comments: CommentsHandler<T>;

	constructor(transport: ITransport) {
		super('directus_activity', transport);
		this._comments = new CommentsHandler(this.transport);
	}

	get comments(): CommentsHandler<T> {
		return this._comments;
	}
}
