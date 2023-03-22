import { IStorage } from '../storage';
import { IWebSocketTransport } from './transport';

export type WebSocketAuthCredentials = {
	email: string;
	password: string;
};

export type WebSocketAuthResult = {
	type: 'auth';
	status: 'ok' | 'error';
	refresh_token?: string;
};

export type WebSocketAuthOptions = {
	autoRefresh?: boolean;
	staticToken?: string;
	transport: IWebSocketTransport;
	storage: IStorage;
};

export abstract class IWebSocketAuth {
	abstract readonly token: string | null;

	abstract login(credentials: WebSocketAuthCredentials): Promise<WebSocketAuthResult>;
	abstract static(token: string): Promise<boolean>;
}
