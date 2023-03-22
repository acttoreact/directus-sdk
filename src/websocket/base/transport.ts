import { IWebSocketTransport, WebSocketTransportOptions } from "../transport";
import { getUID } from "./uid";

/**
 * Transport implementation
 */
export class WebSocketTransport extends IWebSocketTransport {
	private socket: WebSocket;
	private config: WebSocketTransportOptions;

	private openListeners = new Set<() => void>();
	private closeListeners = new Set<() => void>();
	private errorListeners = new Set<(err: Event) => void>();
	private messageListeners = new Set<(event: Record<string, any>) => void>();

	constructor(config: WebSocketTransportOptions) {
		super();

		this.config = config;
		this.socket = new WebSocket(config.url);

		this.socket.onopen = () => {
			console.log('Connection established');

			this.openListeners.forEach(listener => listener());
		}

		this.socket.onclose = () => {
			console.log('Connection closed');

			this.closeListeners.forEach(listener => listener());
		}

		this.socket.onerror = (err: Event) => {
			console.error(err);

			this.errorListeners.forEach(listener => listener(err));
		}

		this.socket.onmessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data)
			console.log(data);

			if(data.type === 'ping') {
				this.send({type: 'pong'});
			}

			this.messageListeners.forEach(listener => listener(data));
		}
	}

	get url(): string {
		return this.config.url;
	}

	send(data: Record<string, any>): number {
		try {
			const uid = getUID()
			this.socket.send(JSON.stringify({...data, uid}));

			return uid;

		} catch (err: any) {
			console.error(err);
		}

		return -1;
	}

	request<T = any>(data: Record<string, any>) {
		const uid = this.send(data);

		if (uid !== -1) {
			return this.waitForResponse<T>(uid);
		}

		return Promise.reject(new Error('Request error'));
	}

	private waitForResponse<T = any>(uid: number) {
		return new Promise<T>((resolve, reject) => {
			this.socket.onmessage = (event: MessageEvent) => {
				const data = JSON.parse(event.data);

				if (data.uid === uid) {
					resolve(data);
				}
			};

			setTimeout(() => {
				reject(new Error('Request timeout'));
			}, this.config.responseTimeout || 10_000);
		});
	}

	public onOpen(listener: () => void) {
		this.openListeners.add(listener);
	}

	public onClose(listener: () => void) {
		this.closeListeners.add(listener);
	}

	public onError(listener: (err: Event) => void) {
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

	public offError(listener: (err: Event) => void) {
		this.errorListeners.delete(listener);
	}

	public offMessage(listener: (event: Record<string, any>) => void) {
		this.messageListeners.delete(listener);
	}
}
