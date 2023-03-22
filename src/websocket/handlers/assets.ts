import { EmptyParamError } from '../items';
import { IWebSocketTransport } from '../transport';
import { ID } from '../../types';

export class AssetsHandler {
	private transport: IWebSocketTransport;

	constructor(transport: IWebSocketTransport) {
		this.transport = transport;
	}

	async readOne(id: ID): Promise<any> {
		if (`${id}` === '') throw new EmptyParamError('id');
		const response = await this.transport.request({
			type: 'items',
			collection: 'directus_files',
			action: 'get',
			id,
		});
		return response.data;
	}
}
