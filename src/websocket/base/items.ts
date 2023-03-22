import { IWebSocketTransport } from '../transport';
import { Item, QueryOne, QueryMany, OneItem, ManyItems, ItemInput, EmptyParamError } from '../../items';
import { ID } from '../../types';
import { IItems } from '../items';

export class WebSocketItemsHandler<T extends Item> implements IItems<T> {
	protected transport: IWebSocketTransport;
	protected collection: string;

	constructor(collection: string, transport: IWebSocketTransport) {
		this.collection = collection;
		this.transport = transport;
	}

	async readOne<Q extends QueryOne<T>>(id: ID, query?: Q): Promise<OneItem<T, Q>> {
		if (`${id}` === '') throw new EmptyParamError('id');
		const response = await this.transport.request<OneItem<T, Q>>({
			type: 'items',
			collection: this.collection,
			action: 'read',
			id,
			query,
		});

		return response.data;
	}

	async readMany<Q extends QueryMany<T>>(ids: ID[], query?: Q): Promise<ManyItems<T, Q>> {
		const response = await this.transport.request({
			type: 'items',
			collection: this.collection,
			action: 'read',
			ids,
			query,
		});

		return response.data;
	}

	async readByQuery<Q extends QueryMany<T>>(query?: Q): Promise<ManyItems<T, Q>> {
		const response = await this.transport.request({
			type: 'items',
			collection: this.collection,
			action: 'read',
			query,
		});

		return response.data;
	}

	async createOne<Q extends QueryOne<T>>(item: ItemInput<T>, query?: Q): Promise<OneItem<T, Q>> {
		return (
			await this.transport.request<OneItem<T, Q>>({
				type: 'items',
				collection: this.collection,
				action: 'create',
				data: item,
				query,
			})
		).data;
	}

	async createMany<Q extends QueryMany<T>>(items: ItemInput<T>[], query?: Q): Promise<ManyItems<T, Q>> {
		return (
			await this.transport.request<ManyItems<T, Q>>({
				type: 'items',
				collection: this.collection,
				action: 'create',
				data: items,
				query,
			})
		).data;
	}

	async updateOne<Q extends QueryOne<T>>(id: ID, item: ItemInput<T>, query?: Q): Promise<OneItem<T, Q>> {
		if (`${id}` === '') throw new EmptyParamError('id');
		return (
			await this.transport.request<OneItem<T, Q>>({
				type: 'items',
				collection: this.collection,
				action: 'update',
				id,
				data: item,
				query,
			})
		).data;
	}

	async updateMany<Q extends QueryMany<T>>(ids: ID[], data: ItemInput<T>, query?: Q): Promise<ManyItems<T, Q>> {
		return (
			await this.transport.request<ManyItems<T, Q>>({
				type: 'items',
				collection: this.collection,
				action: 'update',
				ids,
				data,
				query,
			})
		).data;
	}

	async updateBatch<Q extends QueryMany<T>>(items: ItemInput<T>[], query?: Q): Promise<ManyItems<T, Q>> {
		return (
			await this.transport.request<ManyItems<T, Q>>({
				type: 'items',
				collection: this.collection,
				action: 'update',
				data: items,
				query,
			})
		).data;
	}

	async deleteOne(id: ID): Promise<void> {
		if (`${id}` === '') throw new EmptyParamError('id');
		await this.transport.request({
			type: 'items',
			collection: this.collection,
			action: 'delete',
			id,
		});
	}

	async deleteMany(ids: ID[]): Promise<void> {
		await this.transport.request({
			type: 'items',
			collection: this.collection,
			action: 'delete',
			ids,
		});
	}
}
