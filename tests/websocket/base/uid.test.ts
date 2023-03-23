import { getUID } from '../../../src/websocket/base/uid';

describe('uid', () => {
	test('generating uids', () => {
		const ids = [];

		for (let i = 0; i < 10; i++) {
			ids.push(getUID());
		}

		expect(ids).toEqual(['🐒', '🦍', '🦧', '🦍🐒', '🦍🦍', '🦍🦧', '🦧🐒', '🦧🦍', '🦧🦧', '🦍🐒🐒']);
	});
});
