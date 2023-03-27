import { QueryMany } from '../items';
import { ID } from '../types';

export type WebSocketTransportOptions = {
	url: string;
	responseTimeout?: number;
};

type ItemsRequest<T> = {
	type: 'items';
	collection: string;
	action: 'create' | 'read' | 'update' | 'delete';
	id?: ID;
	ids?: ID[];
	query?: QueryMany<T>;
	data?: Partial<T>;
};

type ItemsResponse<T> = {
	type: 'items';
	data: T;
};

// type Error = {
// 	type: 'error',
// 	error: any,
// }

type SubscribeRequest<T> = {
	type: 'subscribe';
	collection: string;
	id?: ID;
	ids?: ID[];
	query?: QueryMany<T>;
};

type SubscribeResponse<T> = {
	type: 'subscription';
	event: 'init' | 'create' | 'update' | 'delete';
	payload: T;
};

type AuthRequest =
	| {
			type: 'auth';
			email: string;
			password: string;
	  }
	| {
			type: 'auth';
			access_token: string;
	  }
	| {
			type: 'auth';
			refresh_token: string;
	  };

type AuthResponse =
	| {
			type: 'auth';
			status: 'ok';
			refresh_token: string;
	  }
	| {
			type: 'auth';
			status: 'error';
			error: {
				code: string;
				message: string;
			};
	  };

export abstract class IWebSocketTransport {
	abstract send(data: Record<string, any>): string;
	abstract request<T = any, R = any>(data: ItemsRequest<R>): Promise<ItemsResponse<T>>;
	abstract request<T = any>(data: SubscribeRequest<T>): Promise<SubscribeResponse<T>>;
	abstract request(data: AuthRequest): Promise<AuthResponse>;
	abstract onOpen(listener: () => void): void;
	abstract onClose(listener: () => void): void;
	abstract onError(listener: (err: Error) => void): void;
	abstract onMessage(listener: (event: Record<string, any>) => void): void;

	abstract offOpen(listener: () => void): void;
	abstract offClose(listener: () => void): void;
	abstract offError(listener: (err: Error) => void): void;
	abstract offMessage(listener: (event: Record<string, any>) => void): void;
}
