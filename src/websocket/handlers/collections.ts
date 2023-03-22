/**
 * Collections handler
 */

import { ManyItems, OneItem, ItemInput, QueryOne, EmptyParamError } from '../../items';
import { IWebSocketTransport } from '../transport';
import { CollectionItem } from '../../types';
export class WebSocketCollectionsHandler<T = CollectionItem> {
	transport: IWebSocketTransport;
	constructor(transport: IWebSocketTransport) {
		this.transport = transport;
	}

	async readOne(collection: string): Promise<OneItem<NonNullable<T>>> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_collections',
			action: 'read',
		});
		return response.data as OneItem<NonNullable<T>>;
	}

	async readAll(): Promise<ManyItems<NonNullable<T>>> {
		const response = await this.transport.request<ManyItems<NonNullable<T>>>({
			type: 'items',
			collection: 'directus_collections',
			action: 'read',
		});

		return response.data;
	}

	async createOne(collection: ItemInput<T>): Promise<OneItem<NonNullable<T>>> {
		return (
			await this.transport.request<OneItem<NonNullable<T>>>({
				type: 'items',
				collection: 'directus_collections',
				action: 'create',
				data: collection,
			})
		).data;
	}

	async createMany(collections: ItemInput<T>[]): Promise<ManyItems<NonNullable<T>>> {
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_collections',
			action: 'create',
			data: collections,
		});

		return response.data;
	}

	async updateOne(collection: string, item: ItemInput<T>, query?: QueryOne<T>): Promise<OneItem<NonNullable<T>>> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		return (
			await this.transport.request<OneItem<NonNullable<T>>>({
				type: 'items',
				collection: 'directus_collections',
				action: 'update',
				id: collection,
				data: item,
				query,
			})
		).data;
	}

	async deleteOne(collection: string): Promise<void> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		await this.transport.request({
			type: 'items',
			collection: 'directus_collections',
			action: 'delete',
			id: collection,
		});
	}
}
