/**
 * Settings handler
 */
import { SettingItem } from '../../types';
import { IWebSocketTransport } from '../transport';
import { WebSocketSingletonHandler } from './singleton';

export class WebSocketSettingsHandler<T = SettingItem> extends WebSocketSingletonHandler<T> {
	constructor(transport: IWebSocketTransport) {
		super('directus_settings', transport);
	}
}
