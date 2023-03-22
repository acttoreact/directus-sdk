/**
 * Revisions handler
 */

import { WebSocketItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { DefaultType } from '../../types';
import { RevisionItem } from '../../types';

export class WebSocketRevisionsHandler<T = DefaultType> extends WebSocketItemsHandler<RevisionItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_revisions', transport);
	}
}
