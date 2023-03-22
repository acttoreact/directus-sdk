import { IDirectusWebSocket } from '../directus';
import {
	ActivityHandler,
	AssetsHandler,
	CollectionsHandler,
	FieldsHandler,
	FilesHandler,
	FoldersHandler,
	PermissionsHandler,
	PresetsHandler,
	RelationsHandler,
	RevisionsHandler,
	RolesHandler,
	ServerHandler,
	SettingsHandler,
	UsersHandler,
	UtilsHandler,
} from '../handlers';
import { IItems } from '../items';
import { IWebSocketTransport, WebSocketTransportOptions } from '../transport';
import { ItemsHandler } from './items';
import { WebSocketTransport } from './transport';
import { WebSocketAuth } from './auth';
import { LocalStorage, MemoryStorage } from '../../storage';
import { TypeMap, TypeOf, PartialBy } from '../../types';
import { GraphQLHandler } from '../handlers/graphql';
import { ISingleton } from '../singleton';
import { SingletonHandler } from '../handlers/singleton';
import { DirectusStorageOptions } from '../../storage';
import { IStorage } from '../../storage';
import { IWebSocketAuth, WebSocketAuthOptions } from '../auth';
import { Subscriptions } from './subscriptions';


export type DirectusOptions<IAuthHandler extends IWebSocketAuth = WebSocketAuth> = {
	auth?: IAuthHandler | PartialBy<WebSocketAuthOptions, 'transport' | 'storage'>;
	transport?: IWebSocketTransport | Partial<WebSocketTransportOptions>;
	storage?: IStorage | DirectusStorageOptions;
};

export class DirectusWebsocket<T extends TypeMap, IAuthHandler extends IWebSocketAuth = WebSocketAuth> implements IDirectusWebSocket<T> {
	private _url: string;
	private _options?: DirectusOptions;
	private _auth: IAuthHandler;
	private _transport: IWebSocketTransport;
	private _storage: IStorage;
	private _assets?: AssetsHandler;
	private _activity?: ActivityHandler<TypeOf<T, 'directus_activity'>>;
	private _collections?: CollectionsHandler<TypeOf<T, 'directus_collections'>>;
	private _fields?: FieldsHandler<TypeOf<T, 'directus_fields'>>;
	private _files?: FilesHandler<TypeOf<T, 'directus_files'>>;
	private _folders?: FoldersHandler<TypeOf<T, 'directus_folders'>>;
	private _permissions?: PermissionsHandler<TypeOf<T, 'directus_permissions'>>;
	private _presets?: PresetsHandler<TypeOf<T, 'directus_presets'>>;
	private _relations?: RelationsHandler<TypeOf<T, 'directus_relations'>>;
	private _revisions?: RevisionsHandler<TypeOf<T, 'directus_revisions'>>;
	private _roles?: RolesHandler<TypeOf<T, 'directus_roles'>>;
	private _users?: UsersHandler<TypeOf<T, 'directus_users'>>;
	private _server?: ServerHandler;
	private _utils?: UtilsHandler;
	private _graphql?: GraphQLHandler;
	private _settings?: SettingsHandler<TypeOf<T, 'directus_settings'>>;
	private _subscriptions: Subscriptions;

	private _items: {
		[collection: string]: ItemsHandler<any>;
	};

	private _singletons: {
		[collection: string]: SingletonHandler<any>;
	};

	constructor(url: string, options?: DirectusOptions) {
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

		if(this._options?.auth instanceof IWebSocketAuth) {
			this._auth = this._options.auth;
		} else {
			this._auth = new WebSocketAuth({
				transport: this._transport,
				storage: this._storage,
				...this._options?.auth,
			});
		}

		
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

	get assets(): AssetsHandler {
		return this._assets || (this._assets = new AssetsHandler(this.transport));
	}

	get activity(): ActivityHandler<TypeOf<T, 'directus_activity'>> {
		return this._activity || (this._activity = new ActivityHandler<TypeOf<T, 'directus_activity'>>(this.transport));
	}

	get collections(): CollectionsHandler<TypeOf<T, 'directus_collections'>> {
		return (
			this._collections ||
			(this._collections = new CollectionsHandler<TypeOf<T, 'directus_collections'>>(this.transport))
		);
	}

	get fields(): FieldsHandler<TypeOf<T, 'directus_fields'>> {
		return this._fields || (this._fields = new FieldsHandler<TypeOf<T, 'directus_fields'>>(this.transport));
	}

	get files(): FilesHandler<TypeOf<T, 'directus_files'>> {
		return this._files || (this._files = new FilesHandler<TypeOf<T, 'directus_files'>>(this.transport));
	}

	get folders(): FoldersHandler<TypeOf<T, 'directus_folders'>> {
		return this._folders || (this._folders = new FoldersHandler<TypeOf<T, 'directus_folders'>>(this.transport));
	}

	get permissions(): PermissionsHandler<TypeOf<T, 'directus_permissions'>> {
		return (
			this._permissions ||
			(this._permissions = new PermissionsHandler<TypeOf<T, 'directus_permissions'>>(this.transport))
		);
	}

	get presets(): PresetsHandler<TypeOf<T, 'directus_presets'>> {
		return this._presets || (this._presets = new PresetsHandler<TypeOf<T, 'directus_presets'>>(this.transport));
	}

	get relations(): RelationsHandler<TypeOf<T, 'directus_relations'>> {
		return this._relations || (this._relations = new RelationsHandler<TypeOf<T, 'directus_relations'>>(this.transport));
	}

	get revisions(): RevisionsHandler<TypeOf<T, 'directus_revisions'>> {
		return this._revisions || (this._revisions = new RevisionsHandler<TypeOf<T, 'directus_revisions'>>(this.transport));
	}

	get roles(): RolesHandler<TypeOf<T, 'directus_roles'>> {
		return this._roles || (this._roles = new RolesHandler<TypeOf<T, 'directus_roles'>>(this.transport));
	}

	get users(): UsersHandler<TypeOf<T, 'directus_users'>> {
		return this._users || (this._users = new UsersHandler<TypeOf<T, 'directus_users'>>(this.transport));
	}
	get settings(): SettingsHandler<TypeOf<T, 'directus_settings'>> {
		return this._settings || (this._settings = new SettingsHandler<TypeOf<T, 'directus_settings'>>(this.transport));
	}
	get server(): ServerHandler {
		return this._server || (this._server = new ServerHandler(this.transport));
	}

	get utils(): UtilsHandler {
		return this._utils || (this._utils = new UtilsHandler(this.transport));
	}

	get graphql(): GraphQLHandler {
		return this._graphql || (this._graphql = new GraphQLHandler(this.transport));
	}

	singleton<C extends string, I = TypeOf<T, C>>(collection: C): ISingleton<I> {
		return (
			this._singletons[collection] ||
			(this._singletons[collection] = new SingletonHandler<I>(collection, this.transport))
		);
	}

	items<C extends string, I = TypeOf<T, C>>(collection: C): IItems<I> {
		return this._items[collection] || (this._items[collection] = new ItemsHandler<I>(collection, this.transport));
	}

	subscribe<C extends string, I = TypeOf<T, C>>(collection: C, callback: (data: IItems<I>[]) => void) {
		if (!this._subscriptions) this._subscriptions = new Subscriptions(this.transport);

		return this._subscriptions.subscribe(collection, callback);
	}
}
