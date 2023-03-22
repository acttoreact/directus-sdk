/**
 * Presets handler
 */

import { WebSocketItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { DefaultType } from '../../types';
import { PresetItem } from '../../types';

export class WebSocketPresetsHandler<T = DefaultType> extends WebSocketItemsHandler<PresetItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_presets', transport);
	}
}
