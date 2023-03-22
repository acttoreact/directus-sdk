import { IWebSocketAuth } from './auth';
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
} from './handlers';

import { IItems } from './items';
import { TypeMap, TypeOf } from '../types';
import { ISingleton } from '../items';
import { IStorage } from '../storage';
import { IWebSocketTransport } from './transport';

export interface IWebSocketDirectusBase {
	readonly url: string;
	readonly auth: IWebSocketAuth;
	readonly storage: IStorage;
	readonly transport: IWebSocketTransport;
}

export interface IDirectusWebSocket<T extends TypeMap> extends IWebSocketDirectusBase {
	readonly activity: WebSocketActivityHandler<TypeOf<T, 'directus_activity'>>;
	readonly collections: WebSocketCollectionsHandler<TypeOf<T, 'directus_collections'>>;
	readonly files: WebSocketFilesHandler<TypeOf<T, 'directus_files'>>;
	readonly fields: WebSocketFieldsHandler<TypeOf<T, 'directus_fields'>>;
	readonly folders: WebSocketFoldersHandler<TypeOf<T, 'directus_folders'>>;
	readonly permissions: WebSocketPermissionsHandler<TypeOf<T, 'directus_permissions'>>;
	readonly presets: WebSocketPresetsHandler<TypeOf<T, 'directus_presets'>>;
	readonly revisions: WebSocketRevisionsHandler<TypeOf<T, 'directus_revisions'>>;
	readonly relations: WebSocketRelationsHandler<TypeOf<T, 'directus_relations'>>;
	readonly roles: WebSocketRolesHandler<TypeOf<T, 'directus_roles'>>;
	readonly users: WebSocketUsersHandler<TypeOf<T, 'directus_users'>>;
	readonly settings: WebSocketSettingsHandler<TypeOf<T, 'directus_settings'>>;

	items<C extends string, I = TypeOf<T, C>>(collection: C): IItems<I>;
	singleton<C extends string, I = TypeOf<T, C>>(collection: C): ISingleton<I>;

	subscribe<C extends string, I = TypeOf<T, C>>(collection: C, callback: (items: IItems<I>) => void): () => void;
}
