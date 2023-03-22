/**
 * Folders handler
 */

import { ItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { FolderType, DefaultType } from '../../types';

export type FolderItem<T = DefaultType> = FolderType & T;

export class FoldersHandler<T = DefaultType> extends ItemsHandler<FolderItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_folders', transport);
	}
}
