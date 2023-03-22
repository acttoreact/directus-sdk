/**
 * Settings handler
 */
import { ITransport } from '../transport';
import { SingletonHandler } from './singleton';
import { SettingItem } from '../../types';

export class SettingsHandler<T = SettingItem> extends SingletonHandler<T> {
	constructor(transport: ITransport) {
		super('directus_settings', transport);
	}
}
