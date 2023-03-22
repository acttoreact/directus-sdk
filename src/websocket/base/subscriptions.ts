import { QueryMany } from '../../items';
import { ID } from '../../types';
import { IWebSocketTransport } from '../transport';

export type SubscriptionOptions<T, C> = {
	collection: C;
	id?: ID;
	ids?: ID[];
	query?: QueryMany<T>;
};

export class Subscriptions {
	private _transport: IWebSocketTransport;
	private _subscriptions: { [key: string]: any } = {};

	constructor(transport: IWebSocketTransport) {
		this._transport = transport;

		this._transport.onMessage((data) => {
			if (data.uid && this._subscriptions[data.uid]) {
				const uid = data.uid;
				delete data.uid;
				this._subscriptions[uid](data);
			}
		});
	}

	subscribe<T, C>(options: SubscriptionOptions<T, C>, callback: (data: any) => void) {
		const uid = this._transport.send({
			type: 'subscribe',
			...options,
		});

		this._subscriptions[uid] = callback;

		const unsubscribe = () => {
			this._transport.send({
				type: 'unsubscribe',
				...options,
			});

			delete this._subscriptions[uid];
		};

		return unsubscribe;
	}
}
