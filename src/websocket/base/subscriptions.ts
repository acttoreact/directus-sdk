import { Item, QueryMany, QueryOne } from '../../items';
import { ID } from '../../types';
import { SubscriptionItem, SubscriptionResponse } from '../subscription';
import { IWebSocketTransport } from '../transport';

export type SubscriptionOptions<T> = {
	id?: ID;
	ids?: ID[];
	query?: QueryMany<T>;
};

export class SubscriptionsHandler<T extends Item> {
	private _collection: string;
	private _transport: IWebSocketTransport;
	private _subscriptions: { [key: string]: any } = {};

	constructor(collection: string, transport: IWebSocketTransport) {
		this._transport = transport;
		this._collection = collection;

		this._transport.onMessage((data) => {
			if (data.uid && this._subscriptions[data.uid]) {
				const uid = data.uid;
				delete data.uid;
				delete data.type;
				this._subscriptions[uid](data);
			}
		});
	}

	one<Q extends QueryOne<T>>(
		id: ID,
		callback: (data: SubscriptionResponse<SubscriptionItem<T, Q>[]>) => void,
		query?: Q
	) {
		return this.subscribe({ id, query }, callback);
	}

	many<Q extends QueryMany<T>>(
		ids: ID[],
		callback: (data: SubscriptionResponse<SubscriptionItem<T, Q>[]>) => void,
		query?: Q
	) {
		return this.subscribe({ ids, query }, callback);
	}

	byQuery<Q extends QueryMany<T>>(query: Q, callback: (data: SubscriptionResponse<SubscriptionItem<T, Q>[]>) => void) {
		return this.subscribe({ query }, callback);
	}

	private subscribe<T>(options: SubscriptionOptions<T>, callback: (data: any) => void) {
		const uid = this._transport.send({
			collection: this._collection,
			type: 'subscribe',
			...options,
		});

		this._subscriptions[uid] = callback;

		const unsubscribe = () => {
			this._transport.send({
				type: 'unsubscribe',
				collection: this._collection,
				...options,
			});

			delete this._subscriptions[uid];
		};

		return unsubscribe;
	}
}
