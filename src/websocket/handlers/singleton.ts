import { IWebSocketTransport } from '../transport';
import { QueryOne, OneItem, ItemInput } from '../items';
import { ISingleton } from '../singleton';

export class SingletonHandler<T> implements ISingleton<T> {
	protected collection: string;
	protected transport: IWebSocketTransport;
	protected endpoint: string;

	constructor(collection: string, transport: IWebSocketTransport) {
		this.collection = collection;
		this.transport = transport;
		this.endpoint = collection.startsWith('directus_') ? `/${collection.substring(9)}` : `/items/${collection}`;
	}

	async read<Q extends QueryOne<T>>(query?: Q): Promise<OneItem<T, Q>> {
		const item = await this.transport.request<OneItem<T, Q>>({
			type: 'items',
			collection: this.collection,
			action: 'get',
			query,
		});
		return item.data;
	}

	async update<Q extends QueryOne<T>>(data: ItemInput<T>, _query?: Q): Promise<OneItem<T, Q>> {
		const item = await this.transport.request<OneItem<T, Q>>({
			type: 'items',
			collection: this.collection,
			action: 'update',
			data,
		});

		return item.data;
	}
}
