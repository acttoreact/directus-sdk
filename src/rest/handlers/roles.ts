/**
 * Roles handler
 */

import { ItemsHandler } from '../base/items';
import { ITransport } from '../transport';
import { DefaultType } from '../../types';
import { RoleItem } from '../../types';

export class RolesHandler<T = DefaultType> extends ItemsHandler<RoleItem<T>> {
	constructor(transport: ITransport) {
		super('directus_roles', transport);
	}
}
