import { DirectusWebSocket } from '../../../src';

const webSocketServer = {
	send: jest.fn(),
	onmessage: jest.fn(),
};

jest.mock('websocket', () => {
	return {
		w3cwebsocket: jest.fn().mockImplementation(() => webSocketServer),
	};
});

afterEach(jest.clearAllMocks);

describe('items', function () {
	const sdk = new DirectusWebSocket('http://example.com', {
		transport: {
			responseTimeout: 1000,
		},
	});

	test('reading one item', async function () {
		const promise = sdk.items('my-col').readOne(1);

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'items',
				collection: 'my-col',
				action: 'read',
				id: 1,
				uid: '🐒',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'items', data: [{ hello: 'world' }], uid: '🐒' }) });

		expect(await promise).toEqual([{ hello: 'world' }]);
	});

	test('reading many items', async function () {
		const promise = sdk.items('my-col').readMany([1, 2, 3]);

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'items',
				collection: 'my-col',
				action: 'read',
				ids: [1, 2, 3],
				uid: '🦍',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'items', data: [{ hello: 'world' }], uid: '🦍' }) });

		expect(await promise).toEqual([{ hello: 'world' }]);
	});

	test('reading by query', async function () {
		const promise = sdk.items('my-col').readByQuery({ filter: { id: { _eq: 1 } } });

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'items',
				collection: 'my-col',
				action: 'read',
				query: { filter: { id: { _eq: 1 } } },
				uid: '🦧',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'items', data: [{ hello: 'world' }], uid: '🦧' }) });

		expect(await promise).toEqual([{ hello: 'world' }]);
	});

	test('creating one', async function () {
		const promise = sdk.items('my-col').createOne({ hello: 'world' });

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'items',
				collection: 'my-col',
				action: 'create',
				data: { hello: 'world' },
				uid: '🦍🐒',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'items', data: [{ hello: 'world' }], uid: '🦍🐒' }) });

		expect(await promise).toEqual([{ hello: 'world' }]);
	});

	test('creating many', async function () {
		const promise = sdk.items('my-col').createMany([{ hello: 'world' }]);

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'items',
				collection: 'my-col',
				action: 'create',
				data: [{ hello: 'world' }],
				uid: '🦍🦍',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'items', data: [{ hello: 'world' }], uid: '🦍🦍' }) });

		expect(await promise).toEqual([{ hello: 'world' }]);
	});

	test('updating one', async function () {
		const promise = sdk.items('my-col').updateOne(1, { hello: 'world' });

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'items',
				collection: 'my-col',
				action: 'update',
				id: 1,
				data: { hello: 'world' },
				uid: '🦍🦧',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'items', data: [{ hello: 'world' }], uid: '🦍🦧' }) });

		expect(await promise).toEqual([{ hello: 'world' }]);
	});

	test('updating many', async function () {
		const promise = sdk.items('my-col').updateMany([1, 2, 3], { hello: 'world' });

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'items',
				collection: 'my-col',
				action: 'update',
				ids: [1, 2, 3],
				data: { hello: 'world' },
				uid: '🦧🐒',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'items', data: [{ hello: 'world' }], uid: '🦧🐒' }) });

		expect(await promise).toEqual([{ hello: 'world' }]);
	});

	test('delete one', async function () {
		const promise = sdk.items('my-col').deleteOne(1);

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'items',
				collection: 'my-col',
				action: 'delete',
				id: 1,
				uid: '🦧🦍',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'items', data: [{ hello: 'world' }], uid: '🦧🦍' }) });

		expect(await promise).toEqual(undefined);
	});

	test('delete many', async function () {
		const promise = sdk.items('my-col').deleteMany([1, 2, 3]);

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'items',
				collection: 'my-col',
				action: 'delete',
				ids: [1, 2, 3],
				uid: '🦧🦧',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'items', data: [{ hello: 'world' }], uid: '🦧🦧' }) });

		expect(await promise).toEqual(undefined);
	});
});
