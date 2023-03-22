export type WebSocketTransportOptions =  {
	url: string;
	responseTimeout?: number;
	mode: 'public' | 'handshake' | 'strict'
}

export type TransportResponse<T> = {
	type: 'items',
	data: T,
} | {
	type: 'subscription',
	payload: T[],
};

export abstract class IWebSocketTransport {
	abstract send(data: Record<string, any>): number;
	abstract request<T = any>(data: Record<string, any>): Promise<TransportResponse<T>>;
	abstract onOpen(listener: () => void): void;
	abstract onClose(listener: () => void): void;
	abstract onError(listener: (err: Event) => void): void;
	abstract onMessage(listener: (event: Record<string, any>) => void): void;
	
	abstract offOpen(listener: () => void): void;
	abstract offClose(listener: () => void): void;
	abstract offError(listener: (err: Event) => void): void;
	abstract offMessage(listener: (event: Record<string, any>) => void): void;
}