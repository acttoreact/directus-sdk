import {
	ITransport,
	TransportMethods,
	TransportResponse,
	TransportError,
	TransportOptions,
	RequestConfig,
} from '../transport';

function encode(val: string): string {
	return encodeURIComponent(val)
		.replace(/%3A/gi, ':')
		.replace(/%24/g, '$')
		.replace(/%2C/gi, ',')
		.replace(/%20/g, '+')
		.replace(/%5B/gi, '[')
		.replace(/%5D/gi, ']');
}

function serializeSearchParams(obj: object, prefix = '', isArray = false): string {
	const str = [];
	let p;
	for (p in obj) {
		// eslint-disable-next-line no-prototype-builtins
		if (obj.hasOwnProperty(p)) {
			const k = prefix ? `${prefix}[${isArray ? '' : p}]` : p;
			const v = obj[p as keyof typeof obj];
			if (v !== null && Array.isArray(v)) {
				str.push(serializeSearchParams(v, k, Array.isArray(v)));
			} else if (v !== null && typeof v === 'object') {
				str.push(`${encode(k)}=${encodeURIComponent(JSON.stringify(v))}`);
			} else {
				str.push(`${encode(k)}=${encode(v)}`);
			}
		}
	}
	return str.join('&');
}

/**
 * Transport implementation
 */
export class Transport extends ITransport {
	private config: TransportOptions;

	constructor(config: TransportOptions) {
		super();

		this.config = config;

		if (this.config.url.endsWith('/')) {
			this.config.url = this.config.url.slice(0, -1);
		}

		if (this.config?.beforeRequest) {
			this.beforeRequest = this.config.beforeRequest;
		}
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
		data?: any,
		options?: Omit<TransportOptions, 'url'>
	): Promise<TransportResponse<T, R>> {
		try {
			let config: RequestConfig = {
				method,
				url: `${this.config.url}${path}`,
				params: options?.params,
				headers: options?.headers || {},
				responseType: options?.responseType,
				onUploadProgress: options?.onUploadProgress,
				credentials: options?.credentials,
			};

			if (config.params) {
				config.url = `${config.url}?${serializeSearchParams(config.params)}`;
			}

			if (data) {
				config.body = JSON.stringify(data);
			}

			config = await this.beforeRequest(config);

			const response = await fetch(config.url, {
				method: config.method.toUpperCase(),
				headers: {
					'Content-Type': 'application/json',
					...config.headers,
				},
				body: JSON.stringify(data),
				credentials: config?.credentials,
			});

			const responseText = await response.text();
			let isJsonResponse = true;
			let result = responseText as any;
			try {
				result = JSON.parse(responseText);
			} catch (e) {
				isJsonResponse = false;
			}

			if (response.status >= 400) {
				throw new TransportError<T, R>(null, {
					raw: result,
					status: response.status,
					statusText: response.statusText,
					headers: response.headers,
					data: isJsonResponse ? result.data : undefined,
					meta: isJsonResponse ? result.meta : undefined,
					errors: isJsonResponse ? result.errors : undefined,
				});
			}

			if (!isJsonResponse) {
				return {
					raw: result,
					status: response.status,
					statusText: response.statusText,
					headers: response.headers,
				};
			}

			const content = {
				raw: result,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
				data: result.data,
				meta: result.meta,
				errors: result.errors,
			};

			if (result.errors && result.errors.length > 0) {
				throw new TransportError<T, R>(null, content);
			}

			return content;
		} catch (err: any) {
			if (!err || err instanceof Error === false || err instanceof TransportError) {
				throw err;
			}

			if (typeof err === 'object' && err.toString().startsWith('FetchError:')) {
				const message = err.message as string;
				const reason = message.match(/reason: (.+)$/)?.[1];
				throw new TransportError<T>(new Error(reason || message));
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
