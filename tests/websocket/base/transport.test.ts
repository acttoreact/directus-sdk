import { WebSocketTransport } from '../../../src';

const webSocketServer = {
	send: jest.fn(),
	onmessage: jest.fn(),
	onopen: jest.fn(),
	onclose: jest.fn(),
	onerror: jest.fn(),
};

jest.mock('websocket', () => {
	return {
		w3cwebsocket: jest.fn().mockImplementation(() => webSocketServer),
	};
});

afterEach(jest.clearAllMocks);

describe('websocket transport', function () {
	const transport = new WebSocketTransport({
		url: 'ws://localhost:8080',
		mode: 'public',
		responseTimeout: 1000,
	});

	test('sending a message', function () {
		transport.send({ hello: 'world' });

		expect(webSocketServer.send).toHaveBeenCalledWith(JSON.stringify({ hello: 'world', uid: '🐒' }));
	});

	test('sending a request', async function () {
		const promise = transport.request({ hello: 'world' });

		expect(webSocketServer.send).toHaveBeenCalledWith(JSON.stringify({ hello: 'world', uid: '🦍' }));

		webSocketServer.onmessage({ data: JSON.stringify({ uid: '🦍', hello: 'world' }) });

		expect(await promise).toEqual({ hello: 'world' });
	});

	test('on open event', async function () {
		const fn = jest.fn();

		transport.onOpen(fn);

		webSocketServer.onopen();

		expect(fn).toHaveBeenCalled();

		transport.offOpen(fn);

		webSocketServer.onopen();

		expect(fn).toHaveBeenCalledTimes(1);
	});

	test('on close event', async function () {
		const fn = jest.fn();

		transport.onClose(fn);

		webSocketServer.onclose({ code: 1000, reason: 'test', wasClean: true });

		expect(fn).toHaveBeenCalled();

		transport.offClose(fn);

		webSocketServer.onclose({ code: 1000, reason: 'test', wasClean: true });

		expect(fn).toHaveBeenCalledTimes(1);
	});

	test('on error event', async function () {
		const fn = jest.fn();

		transport.onError(fn);

		webSocketServer.onerror(new Error('test'));

		expect(fn).toHaveBeenCalled();

		transport.offError(fn);

		webSocketServer.onerror(new Error('test'));

		expect(fn).toHaveBeenCalledTimes(1);
	});

	test('on message event', async function () {
		const fn = jest.fn();

		transport.onMessage(fn);

		webSocketServer.onmessage({ data: JSON.stringify({ uid: '🦍', hello: 'world' }) });

		expect(fn).toHaveBeenCalledWith({ uid: '🦍', hello: 'world' });

		transport.offMessage(fn);

		webSocketServer.onmessage({ data: JSON.stringify({ uid: '🦍', hello: 'world' }) });

		expect(fn).toHaveBeenCalledTimes(1);
	});

	test('on message event with ping', async function () {
		webSocketServer.onmessage({ data: JSON.stringify({ type: 'ping' }) });

		expect(webSocketServer.send).toHaveBeenLastCalledWith(JSON.stringify({ type: 'pong', uid: '🦧' }));
	});

	test('on message timeout', async function () {
		try {
			await transport.request({ hello: 'world' });
		} catch (error) {
			expect(error).toEqual(new Error('Request timeout'));
		}
	});

	test('getting the url', function () {
		expect(transport.url).toEqual('ws://localhost:8080');
	});
});
