/**
 * Revisions handler
 */

import { ItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { RevisionType, DefaultType } from '../../types';

export type RevisionItem<T = DefaultType> = RevisionType & T;

export class RevisionsHandler<T = DefaultType> extends ItemsHandler<RevisionItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_revisions', transport);
	}
}
