/**
 * Permissions handler
 */

import { WebSocketItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { DefaultType, PermissionItem } from '../../types';

export class WebSocketPermissionsHandler<T = DefaultType> extends WebSocketItemsHandler<PermissionItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_permissions', transport);
	}
}
