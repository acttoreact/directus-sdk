/**
 * Presets handler
 */

import { ItemsHandler } from '../base/items';
import { ITransport } from '../transport';
import { DefaultType } from '../../types';
import { PresetItem } from '../../types';

export class PresetsHandler<T = DefaultType> extends ItemsHandler<PresetItem<T>> {
	constructor(transport: ITransport) {
		super('directus_presets', transport);
	}
}
