import { DirectusWebSocket } from '../../../src';

const webSocketServer = {
	send: jest.fn(),
	onmessage: jest.fn(),
	onopen: jest.fn(),
};

jest.mock('websocket', () => {
	return {
		w3cwebsocket: jest.fn().mockImplementation(() => webSocketServer),
	};
});

afterEach(jest.clearAllMocks);

describe('auth', () => {
	const sdk = new DirectusWebSocket('http://example.com', {
		auth: {
			staticToken: '🔑',
		},
		transport: {
			responseTimeout: 1000,
		},
	});

	test('logging in with username and password', async () => {
		const promise = sdk.auth.login({
			email: 'admin@example.com',
			password: 'password',
		});

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'auth',
				email: 'admin@example.com',
				password: 'password',
				uid: '🐒',
			})
		);

		webSocketServer.onmessage({
			data: JSON.stringify({ type: 'auth', status: 'ok', refresh_token: '🔑🔑🔑', uid: '🐒' }),
		});

		const response = await promise;

		expect(response).toEqual({
			type: 'auth',
			status: 'ok',
			refresh_token: '🔑🔑🔑',
		});
	});

	test('logging in with token', async () => {
		const promise = sdk.auth.static('token');

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'auth',
				access_token: 'token',
				uid: '🦍',
			})
		);

		webSocketServer.onmessage({
			data: JSON.stringify({ type: 'auth', status: 'ok', refresh_token: '🔑🔑🔑', uid: '🦍' }),
		});

		const response = await promise;

		expect(response).toBe(true);
	});

	test('re-authenticating', async () => {
		const promise = sdk.auth.login({
			email: 'admin@example.com',
			password: 'password',
		});

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'auth',
				email: 'admin@example.com',
				password: 'password',
				uid: '🦧',
			})
		);

		webSocketServer.onmessage({
			data: JSON.stringify({ type: 'auth', status: 'ok', refresh_token: '🔑🔑🔑', uid: '🦧' }),
		});

		const response = await promise;

		expect(response).toEqual({
			type: 'auth',
			status: 'ok',
			refresh_token: '🔑🔑🔑',
		});

		webSocketServer.onmessage({
			data: JSON.stringify({
				type: 'auth',
				status: 'error',
				error: { code: 'TOKEN_EXPIRED', message: 'Token expired' },
			}),
		});

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'auth',
				refresh_token: '🔑🔑🔑',
				uid: '🦍🐒',
			})
		);

		webSocketServer.onmessage({ data: JSON.stringify({ type: 'auth', status: 'ok', refresh_token: '🔑🔑🔑🔑🔑🔑' }) });
	});

	test('logging in with token initially', async () => {
		webSocketServer.onopen();

		expect(webSocketServer.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: 'auth',
				access_token: '🔑',
				uid: '🦍🦍',
			})
		);
	});
});
