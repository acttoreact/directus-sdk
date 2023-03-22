/**
 * Files handler
 */

import { ItemsHandler } from '../base/items';
import { OneItem, ItemInput } from '../../items';
import { ITransport } from '../transport';
import { DefaultType } from '../../types';
import { FileItem } from '../../types';

export class FilesHandler<T = DefaultType> extends ItemsHandler<FileItem<T>> {
	constructor(transport: ITransport) {
		super('directus_files', transport);
	}

	async import(body: { url: string; data?: ItemInput<T> }): Promise<OneItem<NonNullable<T>>> {
		const response = await this.transport.post(`/files/import`, body);
		return response.data as OneItem<NonNullable<T>>;
	}
}
