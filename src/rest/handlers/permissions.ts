/**
 * Permissions handler
 */

import { ItemsHandler } from '../base/items';
import { ITransport } from '../transport';
import { DefaultType } from '../../types';
import { PermissionItem } from '../../types';

export class PermissionsHandler<T = DefaultType> extends ItemsHandler<PermissionItem<T>> {
	constructor(transport: ITransport) {
		super('directus_permissions', transport);
	}
}
