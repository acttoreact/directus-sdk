import { IDirectusWebSocket } from '../directus';
import {
	WebSocketActivityHandler,
	WebSocketCollectionsHandler,
	WebSocketFieldsHandler,
	WebSocketFilesHandler,
	WebSocketFoldersHandler,
	WebSocketPermissionsHandler,
	WebSocketPresetsHandler,
	WebSocketRelationsHandler,
	WebSocketRevisionsHandler,
	WebSocketRolesHandler,
	WebSocketSettingsHandler,
	WebSocketUsersHandler,
} from '../handlers';
import { IWebSocketTransport, WebSocketTransportOptions } from '../transport';
import { WebSocketItemsHandler } from './items';
import { WebSocketTransport } from './transport';
import { WebSocketAuth } from './auth';
import { LocalStorage, MemoryStorage } from '../../storage';
import { TypeMap, TypeOf, PartialBy } from '../../types';
import { ISingleton } from '../../items';
import { WebSocketSingletonHandler } from '../handlers/singleton';
import { DirectusStorageOptions } from '../../storage';
import { IStorage } from '../../storage';
import { IWebSocketAuth, WebSocketAuthOptions } from '../auth';
import { SubscriptionOptions, Subscriptions } from './subscriptions';
import { IItems } from '../items';

export type WebSocketDirectusOptions<IAuthHandler extends IWebSocketAuth = WebSocketAuth> = {
	auth?: IAuthHandler | PartialBy<WebSocketAuthOptions, 'transport' | 'storage'>;
	transport?: IWebSocketTransport | Partial<WebSocketTransportOptions>;
	storage?: IStorage | DirectusStorageOptions;
};

export class DirectusWebsocket<T extends TypeMap, IAuthHandler extends IWebSocketAuth = WebSocketAuth>
	implements IDirectusWebSocket<T>
{
	private _url: string;
	private _options?: WebSocketDirectusOptions<IAuthHandler>;
	private _auth: IAuthHandler;
	private _transport: IWebSocketTransport;
	private _storage: IStorage;
	private _activity?: WebSocketActivityHandler<TypeOf<T, 'directus_activity'>>;
	private _collections?: WebSocketCollectionsHandler<TypeOf<T, 'directus_collections'>>;
	private _fields?: WebSocketFieldsHandler<TypeOf<T, 'directus_fields'>>;
	private _files?: WebSocketFilesHandler<TypeOf<T, 'directus_files'>>;
	private _folders?: WebSocketFoldersHandler<TypeOf<T, 'directus_folders'>>;
	private _permissions?: WebSocketPermissionsHandler<TypeOf<T, 'directus_permissions'>>;
	private _presets?: WebSocketPresetsHandler<TypeOf<T, 'directus_presets'>>;
	private _relations?: WebSocketRelationsHandler<TypeOf<T, 'directus_relations'>>;
	private _revisions?: WebSocketRevisionsHandler<TypeOf<T, 'directus_revisions'>>;
	private _roles?: WebSocketRolesHandler<TypeOf<T, 'directus_roles'>>;
	private _users?: WebSocketUsersHandler<TypeOf<T, 'directus_users'>>;
	private _settings?: WebSocketSettingsHandler<TypeOf<T, 'directus_settings'>>;
	private _subscriptions: Subscriptions;

	private _items: {
		[collection: string]: WebSocketItemsHandler<any>;
	};

	private _singletons: {
		[collection: string]: WebSocketSingletonHandler<any>;
	};

	constructor(url: string, options?: WebSocketDirectusOptions<IAuthHandler>) {
		this._url = url;
		this._options = options;
		this._items = {};
		this._singletons = {};

		if (this._options?.storage && this._options?.storage instanceof IStorage) this._storage = this._options.storage;
		else {
			const directusStorageOptions = this._options?.storage as DirectusStorageOptions | undefined;
			const { mode, ...storageOptions } = directusStorageOptions ?? {};

			if (mode === 'MemoryStorage' || typeof window === 'undefined') {
				this._storage = new MemoryStorage(storageOptions);
			} else {
				this._storage = new LocalStorage(storageOptions);
			}
		}

		if (this._options?.transport instanceof IWebSocketTransport) {
			this._transport = this._options.transport;
		} else {
			this._transport = new WebSocketTransport({
				url: this.url,
				mode: this._options?.transport?.mode ?? 'handshake',
				...this._options?.transport,
			});
		}

		if (this._options?.auth instanceof IWebSocketAuth) {
			this._auth = this._options.auth;
		} else {
			this._auth = new WebSocketAuth({
				transport: this._transport,
				storage: this._storage,
				...this._options?.auth,
			}) as unknown as IAuthHandler;
		}

		this._subscriptions = new Subscriptions(this.transport);
	}

	get url() {
		return this._url;
	}

	get auth(): IAuthHandler {
		return this._auth;
	}

	get storage(): IStorage {
		return this._storage;
	}

	get transport(): IWebSocketTransport {
		return this._transport;
	}

	get activity(): WebSocketActivityHandler<TypeOf<T, 'directus_activity'>> {
		return (
			this._activity || (this._activity = new WebSocketActivityHandler<TypeOf<T, 'directus_activity'>>(this.transport))
		);
	}

	get collections(): WebSocketCollectionsHandler<TypeOf<T, 'directus_collections'>> {
		return (
			this._collections ||
			(this._collections = new WebSocketCollectionsHandler<TypeOf<T, 'directus_collections'>>(this.transport))
		);
	}

	get fields(): WebSocketFieldsHandler<TypeOf<T, 'directus_fields'>> {
		return this._fields || (this._fields = new WebSocketFieldsHandler<TypeOf<T, 'directus_fields'>>(this.transport));
	}

	get files(): WebSocketFilesHandler<TypeOf<T, 'directus_files'>> {
		return this._files || (this._files = new WebSocketFilesHandler<TypeOf<T, 'directus_files'>>(this.transport));
	}

	get folders(): WebSocketFoldersHandler<TypeOf<T, 'directus_folders'>> {
		return (
			this._folders || (this._folders = new WebSocketFoldersHandler<TypeOf<T, 'directus_folders'>>(this.transport))
		);
	}

	get permissions(): WebSocketPermissionsHandler<TypeOf<T, 'directus_permissions'>> {
		return (
			this._permissions ||
			(this._permissions = new WebSocketPermissionsHandler<TypeOf<T, 'directus_permissions'>>(this.transport))
		);
	}

	get presets(): WebSocketPresetsHandler<TypeOf<T, 'directus_presets'>> {
		return (
			this._presets || (this._presets = new WebSocketPresetsHandler<TypeOf<T, 'directus_presets'>>(this.transport))
		);
	}

	get relations(): WebSocketRelationsHandler<TypeOf<T, 'directus_relations'>> {
		return (
			this._relations ||
			(this._relations = new WebSocketRelationsHandler<TypeOf<T, 'directus_relations'>>(this.transport))
		);
	}

	get revisions(): WebSocketRevisionsHandler<TypeOf<T, 'directus_revisions'>> {
		return (
			this._revisions ||
			(this._revisions = new WebSocketRevisionsHandler<TypeOf<T, 'directus_revisions'>>(this.transport))
		);
	}

	get roles(): WebSocketRolesHandler<TypeOf<T, 'directus_roles'>> {
		return this._roles || (this._roles = new WebSocketRolesHandler<TypeOf<T, 'directus_roles'>>(this.transport));
	}

	get users(): WebSocketUsersHandler<TypeOf<T, 'directus_users'>> {
		return this._users || (this._users = new WebSocketUsersHandler<TypeOf<T, 'directus_users'>>(this.transport));
	}
	get settings(): WebSocketSettingsHandler<TypeOf<T, 'directus_settings'>> {
		return (
			this._settings || (this._settings = new WebSocketSettingsHandler<TypeOf<T, 'directus_settings'>>(this.transport))
		);
	}

	singleton<C extends string, I = TypeOf<T, C>>(collection: C): ISingleton<I> {
		return (
			this._singletons[collection] ||
			(this._singletons[collection] = new WebSocketSingletonHandler<I>(collection, this.transport))
		);
	}

	items<C extends string, I = TypeOf<T, C>>(collection: C): IItems<I> {
		return (
			this._items[collection] || (this._items[collection] = new WebSocketItemsHandler<I>(collection, this.transport))
		);
	}

	subscribe<C extends string, I = TypeOf<T, C>>(
		options: SubscriptionOptions<I, C>,
		callback: (data: IItems<I>) => void
	) {
		return this._subscriptions.subscribe(options, callback);
	}
}
