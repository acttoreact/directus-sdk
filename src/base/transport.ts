import { ITransport, TransportResponse, TransportError, TransportOptions } from '../transport';
import type { TransportMethods, RequestConfig } from '../types';

import type { Fetch } from './fetch';
import { fetchWrapper } from './fetch';

function serializeSearchParams(obj: any, prefix = ''): string {
	const str = [];
	let p;
	for (p in obj) {
		// eslint-disable-next-line no-prototype-builtins
		if (obj.hasOwnProperty(p)) {
			const k = prefix ? prefix + '[' + p + ']' : p;
			const v = obj[p];
			str.push(
				v !== null && typeof v === 'object'
					? serializeSearchParams(v, k)
					: encodeURIComponent(k) + '=' + encodeURIComponent(v)
			);
		}
	}
	return str.join('&');
}

/**
 * Transport implementation
 */
export class Transport extends ITransport {
	private fetch: Fetch;
	private config: TransportOptions;

	constructor(config: TransportOptions) {
		super();

		this.config = config;

		this.fetch = fetchWrapper();
		if (this.config?.beforeRequest) this.beforeRequest = this.config.beforeRequest;
	}

	async beforeRequest(config: RequestConfig): Promise<RequestConfig> {
		return config;
	}

	get url(): string {
		return this.config.url;
	}

	protected async request<T = any, R = any>(
		method: TransportMethods,
		path: string,
		data?: Record<string, any>,
		options?: Omit<TransportOptions, 'url'>
	): Promise<TransportResponse<T, R>> {
		try {
			let config: RequestConfig = {
				method,
				url: this.config.url + path,
				headers: options?.headers,
				params: options?.params,
				responseType: options?.responseType,
				onUploadProgress: options?.onUploadProgress,
			};

			if (config.params) {
				config.url += '?' + serializeSearchParams(config.params);
			}
			if (data) {
				config.body = JSON.stringify(data);
			}

			config = await this.beforeRequest(config);

			const response: any = await this.fetch(config.url, {
				method: config.method.toUpperCase(),
				headers: {
					'Content-Type': 'application/json',
					...config.headers,
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				// eslint-disable-next-line no-console
				console.error('ERROR >>> ', response.statusText);
				throw new Error(`An error occured please try again`);
			}

			const result = await response.json();

			// eslint-disable-next-line no-console
			console.log('-----> ', result);

			const content = {
				raw: result as any,
				status: result.status,
				statusText: result.statusText,
				headers: result.headers,
				data: result.data,
				meta: result.data.meta || {},
				errors: result.data.errors || {},
			};

			if (result.data.errors) {
				throw new TransportError<T, R>(null, content);
			}

			return content;
		} catch (err: any) {
			if (!err || err instanceof Error === false) {
				throw err;
			}

			throw new TransportError<T>(err as Error);
		}
	}

	async get<T = any>(path: string, options?: TransportOptions): Promise<TransportResponse<T>> {
		return await this.request('GET', path, undefined, options);
	}

	async head<T = any>(path: string, options?: TransportOptions): Promise<TransportResponse<T>> {
		return await this.request('HEAD', path, undefined, options);
	}

	async options<T = any>(path: string, options?: TransportOptions): Promise<TransportResponse<T>> {
		return await this.request('OPTIONS', path, undefined, options);
	}

	async delete<T = any, D = any>(path: string, data?: D, options?: TransportOptions): Promise<TransportResponse<T>> {
		return await this.request('DELETE', path, data, options);
	}

	async put<T = any, D = any>(path: string, data?: D, options?: TransportOptions): Promise<TransportResponse<T>> {
		return await this.request('PUT', path, data, options);
	}

	async post<T = any, D = any>(path: string, data?: D, options?: TransportOptions): Promise<TransportResponse<T>> {
		return await this.request('POST', path, data, options);
	}

	async patch<T = any, D = any>(path: string, data?: D, options?: TransportOptions): Promise<TransportResponse<T>> {
		return await this.request('PATCH', path, data, options);
	}
}
