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

describe('subscriptions', () => {
	const sdk = new DirectusWebSocket('http://example.com');

	test('subscribe to a collection', () => {
		const fn = jest.fn();

		sdk.subscribe('test').all(fn);

		expect(fn).not.toHaveBeenCalled();

		const lastUID = JSON.parse(webSocketServer.send.mock.calls.at(-1)[0]).uid;

		expect(lastUID).toEqual('🐒');

		webSocketServer.onmessage({
			data: JSON.stringify({ type: 'subscription', event: 'init', payload: [{ hello: 'world' }], uid: lastUID }),
		});

		expect(fn).toHaveBeenLastCalledWith({
			event: 'init',
			payload: [{ hello: 'world' }],
		});

		webSocketServer.onmessage({
			data: JSON.stringify({ type: 'subscription', event: 'add', payload: [{ hello: 'there' }], uid: lastUID }),
		});

		expect(fn).toHaveBeenLastCalledWith({
			event: 'add',
			payload: [{ hello: 'there' }],
		});
	});

	test('subscribe to a collection and ignore message', () => {
		const fn = jest.fn();

		sdk.subscribe('test').all(fn);

		expect(fn).not.toHaveBeenCalled();

		const lastUID = JSON.parse(webSocketServer.send.mock.calls.at(-1)[0]).uid;

		expect(lastUID).toEqual('🦍');

		webSocketServer.onmessage({
			data: JSON.stringify({ type: 'subscription', event: 'init', payload: [{ hello: 'world' }], uid: lastUID }),
		});

		expect(fn).toHaveBeenLastCalledWith({
			event: 'init',
			payload: [{ hello: 'world' }],
		});

		webSocketServer.onmessage({
			data: JSON.stringify({ type: 'subscription', event: 'add', payload: [{ hello: 'there' }], uid: '🐵' }),
		});

		expect(fn).toHaveBeenCalledTimes(1);
	});

	test('unsubscribing', () => {
		const fn = jest.fn();

		const unsubscribe = sdk.subscribe('test').all(fn);

		expect(fn).not.toHaveBeenCalled();

		const lastUID = JSON.parse(webSocketServer.send.mock.calls.at(-1)[0]).uid;

		expect(lastUID).toEqual('🦧');

		webSocketServer.onmessage({
			data: JSON.stringify({ type: 'subscription', event: 'init', payload: [{ hello: 'world' }], uid: lastUID }),
		});

		expect(fn).toHaveBeenLastCalledWith({
			event: 'init',
			payload: [{ hello: 'world' }],
		});

		unsubscribe();

		webSocketServer.onmessage({
			data: JSON.stringify({ type: 'subscription', event: 'add', payload: [{ hello: 'there' }], uid: lastUID }),
		});

		expect(fn).toHaveBeenCalledTimes(1);
	});
});
