/**
 * Users handler
 */

import { WebSocketItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { DefaultType } from '../../types';
import { UserItem } from '../../types';

export class WebSocketUsersHandler<T = DefaultType> extends WebSocketItemsHandler<UserItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_users', transport);
	}
}
