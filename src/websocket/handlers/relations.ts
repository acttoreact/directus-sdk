/**
 * Relations handler
 */
import { ManyItems, OneItem, ItemInput, EmptyParamError } from '../items';
import { IWebSocketTransport } from '../transport';
import { RelationType, DefaultType, ID } from '../../types';

export type RelationItem<T = DefaultType> = RelationType & T;
export class RelationsHandler<T = RelationItem> {
	transport: IWebSocketTransport;

	constructor(transport: IWebSocketTransport) {
		this.transport = transport;
	}

	async readOne(collection: string, id: ID): Promise<OneItem<T>> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		if (`${id}` === '') throw new EmptyParamError('id');
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_relations',
			action: 'read',
			id,
		});
		return response.data as OneItem<T>;
	}

	async readMany(collection: string): Promise<ManyItems<T>> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		const response = await this.transport.get({
			type: 'items',
			collection: 'directus_relations',
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

	async readAll(): Promise<ManyItems<T>> {
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_relations',
			action: 'read',
		});
		return response.data;
	}

	async createOne(item: ItemInput<T>): Promise<OneItem<T>> {
		return (await this.transport.request<OneItem<T>>({
			type: 'items',
			collection: 'directus_relations',
			action: 'create',
			data: item,
		})).data;
	}

	async updateOne(collection: string, field: string, item: ItemInput<T>): Promise<OneItem<T>> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		if (`${field}` === '') throw new EmptyParamError('field');
		return (await this.transport.request<OneItem<T>>({
			type: 'items',
			collection: 'directus_relations',
			action: 'update',
			data: item,
			query: {
				filter: {
					collection: {
						_eq: collection,
					},
					field: {
						_eq: field,
					},
				},
			}
		})).data;
	}

	async deleteOne(collection: string, field: string): Promise<void> {
		if (`${collection}` === '') throw new EmptyParamError('collection');
		if (`${field}` === '') throw new EmptyParamError('field');
		await this.transport.request({
			type: 'items',
			collection: 'directus_relations',
			action: 'delete',
			query: {
				filter: {
					collection: {
						_eq: collection,
					},
					field: {
						_eq: field,
					},
				},
			}
		});
	}
}
