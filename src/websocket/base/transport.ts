import { IWebSocketTransport, WebSocketTransportOptions } from '../transport';
import { getUID } from './uid';
import { w3cwebsocket as WebSocket } from 'websocket';

/**
 * Transport implementation
 */
export class WebSocketTransport extends IWebSocketTransport {
	private socket: WebSocket;
	private config: WebSocketTransportOptions;

	private openListeners = new Set<() => void>();
	private closeListeners = new Set<() => void>();
	private errorListeners = new Set<(err: Error) => void>();
	private messageListeners = new Set<(data: Record<string, any>) => void>();

	constructor(config: WebSocketTransportOptions) {
		super();

		this.config = config;
		this.socket = new WebSocket(config.url, 'echo-protocol');

		this.socket.onopen = () => {
			this.openListeners.forEach((listener) => listener());
		};

		this.socket.onclose = () => {
			this.closeListeners.forEach((listener) => listener());
		};

		this.socket.onerror = (err: Error) => {
			this.errorListeners.forEach((listener) => listener(err));
		};

		this.socket.onmessage = (event) => {
			if (typeof event.data !== 'string') return;
			const data = JSON.parse(event.data);

			// console.log('onmessage', data)

			if (data.type === 'ping') {
				this.send({ type: 'pong' });
			}

			this.messageListeners.forEach((listener) => listener(data));
		};
	}

	get url(): string {
		return this.config.url;
	}

	send(data: Record<string, any>): string {
		const uid = getUID();
		// console.log('send', {...data, uid})
		this.socket.send(JSON.stringify({ ...data, uid }));

		return uid;
	}

	request<T = any>(data: Record<string, any>) {
		const uid = this.send(data);

		if (uid !== '-1') {
			return this.waitForResponse<T>(uid);
		}

		return Promise.reject(new Error('Request error'));
	}

	private waitForResponse<T = any>(uid: string) {
		return new Promise<T>((resolve, reject) => {
			const listener = (data: Record<string, any>) => {
				if (data.uid === uid) {
					delete data.uid;
					resolve(data as T);
				}

				this.offMessage(listener);
			};

			this.onMessage(listener);

			setTimeout(() => {
				reject(new Error('Request timeout'));
				this.offMessage(listener);
			}, this.config.responseTimeout || 10_000);
		});
	}

	public onOpen(listener: () => void) {
		this.openListeners.add(listener);
	}

	public onClose(listener: () => void) {
		this.closeListeners.add(listener);
	}

	public onError(listener: (err: Error) => void) {
		this.errorListeners.add(listener);
	}

	public onMessage(listener: (event: Record<string, any>) => void) {
		this.messageListeners.add(listener);
	}

	public offOpen(listener: () => void) {
		this.openListeners.delete(listener);
	}

	public offClose(listener: () => void) {
		this.closeListeners.delete(listener);
	}

	public offError(listener: (err: Error) => void) {
		this.errorListeners.delete(listener);
	}

	public offMessage(listener: (event: Record<string, any>) => void) {
		this.messageListeners.delete(listener);
	}
}
