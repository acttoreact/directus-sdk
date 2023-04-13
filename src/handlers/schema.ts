/**
 * Schema handler
 */

import { ITransport } from '../transport';
import { Snapshot, SnapshotDiffWithHash } from '../types';

export class SchemaHandler {
	private transport: ITransport;

	constructor(transport: ITransport) {
		this.transport = transport;
	}

	async snapshot(): Promise<Snapshot> {
		return (await this.transport.get<Snapshot>('/schema/snapshot')).data!;
	}

	async diff(snapshot: Snapshot): Promise<Snapshot> {
		return (await this.transport.post<Snapshot>('/schema/diff', snapshot)).data!;
	}

	async apply(diff: SnapshotDiffWithHash): Promise<void> {
		await this.transport.post('/schema/apply', diff);
	}
}
