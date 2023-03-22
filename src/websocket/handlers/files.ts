/**
 * Files handler
 */

import { WebSocketItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { DefaultType } from '../../types';
import { FileItem } from '../../types';

export class WebSocketFilesHandler<T = DefaultType> extends WebSocketItemsHandler<FileItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_files', transport);
	}
}
