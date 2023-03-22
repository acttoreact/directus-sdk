/**
 * Folders handler
 */

import { WebSocketItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { DefaultType } from '../../types';
import { FolderItem } from '../../types';

export class WebSocketFoldersHandler<T = DefaultType> extends WebSocketItemsHandler<FolderItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_folders', transport);
	}
}
