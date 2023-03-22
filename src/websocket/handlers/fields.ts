/**
 * Fields handler
 */

import { ManyItems, OneItem, ItemInput, EmptyParamError, DefaultItem } from '../../items';
import { IWebSocketTransport } from '../transport';
import { ID } from '../../types';
import { FieldItem } from '../../types';

export class WebSocketFieldsHandler<T = FieldItem> {
	transport: IWebSocketTransport;
	constructor(transport: IWebSocketTransport) {
		this.transport = transport;
	}

	async readOne(collection: string, id: ID): Promise<OneItem<NonNullable<T>>> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		if (`${id}` === '') throw new EmptyParamError('id');
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_fields',
			action: 'read',
			id,
		});
		return response.data as OneItem<NonNullable<T>>;
	}

	async readMany(collection: string): Promise<ManyItems<NonNullable<T>>> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_fields',
			action: 'read',
			query: {
				filter: {
					collection: {
						_eq: collection,
					},
				},
			},
		});

		return response.data;
	}

	async readAll(): Promise<ManyItems<NonNullable<T>>> {
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_fields',
			action: 'read',
		});
		return response.data;
	}

	async createOne(collection: string, item: ItemInput<T>): Promise<OneItem<NonNullable<T>>> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		return (
			await this.transport.request<DefaultItem<NonNullable<T>>>({
				type: 'items',
				collection: 'directus_fields',
				action: 'create',
				data: {
					...item,
					collection,
				},
			})
		).data;
	}

	async updateOne(collection: string, field: string, item: ItemInput<T>): Promise<OneItem<NonNullable<T>>> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		if (`${field}` === '') throw new EmptyParamError('field');
		return (
			await this.transport.request<DefaultItem<NonNullable<T>>>({
				type: 'items',
				collection: 'directus_fields',
				action: 'update',
				id: field,
				data: {
					...item,
					collection,
				},
			})
		).data;
	}

	async deleteOne(collection: string, field: string): Promise<void> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		if (`${field}` === '') throw new EmptyParamError('field');
		await this.transport.request({
			type: 'items',
			collection: 'directus_fields',
			action: 'delete',
			id: field,
		});
	}
}
