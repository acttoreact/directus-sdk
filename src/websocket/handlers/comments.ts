import { ActivityItem, Comment, ID } from '../../types';
import { IWebSocketTransport } from '../transport';
import { EmptyParamError } from '../../items';

export class WebSocketCommentsHandler<T> {
	private transport: IWebSocketTransport;

	constructor(transport: IWebSocketTransport) {
		this.transport = transport;
	}

	async create(comment: Comment): Promise<ActivityItem<T>> {
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_activity',
			action: 'create',
			data: comment,
		});
		return response.data as ActivityItem<T>;
	}

	async update(comment_activity_id: ID, comment: string): Promise<ActivityItem<T>> {
		if (`${comment_activity_id}` === '') throw new EmptyParamError('comment_activity_id');
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_activity',
			action: 'update',
			id: comment_activity_id,
			data: { comment },
		});
		return response.data as ActivityItem<T>;
	}

	async delete(comment_activity_id: ID): Promise<void> {
		if (`${comment_activity_id}` === '') throw new EmptyParamError('comment_activity_id');
		await this.transport.request({
			type: 'items',
			collection: 'directus_activity',
			action: 'delete',
			id: comment_activity_id,
		});
	}
}
