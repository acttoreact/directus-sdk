import { AuthCredentials, AuthResult, IWebSocketAuth, WebSocketAuthOptions } from '../auth';
import { IStorage } from '../../storage';
import { IWebSocketTransport } from '../transport';
import { PasswordsHandler } from '../handlers/passwords';

export class WebSocketAuth extends IWebSocketAuth {
	password: PasswordsHandler;
	autoRefresh = true;
	staticToken = '';

	private _storage: IStorage;
	private _transport: IWebSocketTransport;

	constructor(options: WebSocketAuthOptions) {
		super();

		this._transport = options.transport;
		this._storage = options.storage;

		this.autoRefresh = options?.autoRefresh ?? this.autoRefresh;

		if (options?.staticToken) {
			this.staticToken = options?.staticToken;
			this._storage.auth_token = this.staticToken;
		}

		this.password = new PasswordsHandler(this._transport);

		this._transport.onMessage(async (data) => {
			if (data.type === 'auth') {
				if (data.status === 'ok') {
					this._storage.ws_auth_refresh_token = data.refresh_token ?? null;
				} else if(data.status === 'error' && data.error.code === 'TOKEN_EXPIRED') {
					const response = await this._transport.request<AuthResult>({
						type: 'auth',
						refresh_token: this._storage.ws_auth_refresh_token,
					})

					if (response) {
						this._storage.ws_auth_refresh_token = response.refresh_token ?? null;
					} else {
						this.resetStorage()
					}
				} else {
					this.resetStorage()
				}
			}
		})
	}

	get storage(): IStorage {
		return this._storage;
	}

	get transport(): IWebSocketTransport {
		return this._transport;
	}

	get token() {
		return this._storage.ws_auth_token;
	}

	private resetStorage() {
		this._storage.ws_auth_refresh_token = null;
	}

	async login(credentials: AuthCredentials) {
		this.resetStorage();

		const response = await this._transport.request<AuthResult>({
            type: 'auth',
            ...credentials,
        });

		this._storage.auth_refresh_token = response.refresh_token ?? null;

		return response
	}

	async static(token: string): Promise<boolean> {
		if (!this.staticToken) this.staticToken = token;

		await this._transport.request({
			type: 'auth',
            access_token: token,
		});

		this._storage.auth_token = token;

		return true;
	}
}
