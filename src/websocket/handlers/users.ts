/**
 * Users handler
 */

import { ItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { DefaultType, UserType } from '../../types';
export type UserItem<T = DefaultType> = UserType & T;

export class UsersHandler<T = DefaultType> extends ItemsHandler<UserItem<T>> {

	constructor(transport: IWebSocketTransport) {
		super('directus_users', transport);
	}
}
