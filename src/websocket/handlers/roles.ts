/**
 * Roles handler
 */

import { ItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { RoleType, DefaultType } from '../../types';

export type RoleItem<T = DefaultType> = RoleType & T;

export class RolesHandler<T = DefaultType> extends ItemsHandler<RoleItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_roles', transport);
	}
}
