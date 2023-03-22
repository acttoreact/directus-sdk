import { IWebSocketTransport } from "../transport";
import { getUID } from "./uid";

export class Subscriptions {
    private _transport: IWebSocketTransport;
    private _subscriptions: { [key: number]: any } = {};

    constructor(transport: IWebSocketTransport) {
        this._transport = transport;

        this._transport.onMessage((data) => {

            if (data.uid && this._subscriptions[data.uid]) {
                this._subscriptions[data.uid](data);
            }
        })
    }

    subscribe(collection: string, callback: (data: any) => void) {
        const uid = getUID()

        this._transport.send({
            action: 'subscribe',
            collection,
            uid
        });

        this._subscriptions[uid] = callback;

        const unsubscribe = () => {
            this._transport.send({
                action: 'unsubscribe',
                collection,
                uid
            });

            delete this._subscriptions[uid];
        }

        return unsubscribe;
    }
}