/**
 * Presets handler
 */

import { ItemsHandler } from '../base/items';
import { IWebSocketTransport } from '../transport';
import { PresetType, DefaultType } from '../../types';

export type PresetItem<T = DefaultType> = PresetType & T;

export class PresetsHandler<T = DefaultType> extends ItemsHandler<PresetItem<T>> {
	constructor(transport: IWebSocketTransport) {
		super('directus_presets', transport);
	}
}
