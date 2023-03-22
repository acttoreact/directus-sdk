/**
 * Settings handler
 */
import { IWebSocketTransport } from '../transport';
import { SettingType, DefaultType } from '../../types';
import { SingletonHandler } from './singleton';

export type SettingItem<T = DefaultType> = SettingType & T;

export class SettingsHandler<T = SettingItem> extends SingletonHandler<T> {
	constructor(transport: IWebSocketTransport) {
		super('directus_settings', transport);
	}
}
