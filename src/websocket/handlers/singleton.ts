import { IWebSocketTransport } from '../transport';
import { QueryOne, OneItem, ItemInput } from '../../items';
import { ISingleton } from '../../items';

export class WebSocketSingletonHandler<T> implements ISingleton<T> {
	protected collection: string;
	protected transport: IWebSocketTransport;

	constructor(collection: string, transport: IWebSocketTransport) {
		this.collection = collection;
		this.transport = transport;
	}

	async read<Q extends QueryOne<T>>(query?: Q): Promise<OneItem<T, Q>> {
		const item = await this.transport.request<OneItem<T, Q>>({
			type: 'items',
			collection: this.collection,
			action: 'read',
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
