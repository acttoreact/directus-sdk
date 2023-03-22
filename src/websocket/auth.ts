import { IStorage } from '../storage';
import { PasswordsHandler } from './handlers/passwords';
import { IWebSocketTransport } from './transport';

export type AuthCredentials = {
	email: string;
	password: string;
	otp?: string;
};

export type AuthResult = {
	type: 'auth',
	status: 'ok' | 'error',
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
	abstract readonly password: PasswordsHandler;

	abstract login(credentials: AuthCredentials): Promise<AuthResult>;
	abstract static(token: string): Promise<boolean>;
}
