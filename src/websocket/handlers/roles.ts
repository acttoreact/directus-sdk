/**
 * Roles handler
 */

import { WebSocketItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { DefaultType } from '../../types';
import { RoleItem } from '../../types';

export class WebSocketRolesHandler<T = DefaultType> extends WebSocketItemsHandler<RoleItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_roles', transport);
	}
}
