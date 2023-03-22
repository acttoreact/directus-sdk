/**
 * Folders handler
 */

import { FolderItem } from '../../types';
import { ItemsHandler } from '../base/items';
import { ITransport } from '../transport';
import { DefaultType } from '../../types';

export class FoldersHandler<T = DefaultType> extends ItemsHandler<FolderItem<T>> {
	constructor(transport: ITransport) {
		super('directus_folders', transport);
	}
}
