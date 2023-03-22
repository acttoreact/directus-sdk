/**
 * Revisions handler
 */

import { ItemsHandler } from '../base/items';
import { ITransport } from '../transport';
import { DefaultType } from '../../types';
import { RevisionItem } from '../../types';

export class RevisionsHandler<T = DefaultType> extends ItemsHandler<RevisionItem<T>> {
	constructor(transport: ITransport) {
		super('directus_revisions', transport);
	}
}
