import crossFetch, { Headers as CrossFetchHeaders } from 'cross-fetch';

export type Fetch = typeof fetch;

export const resolveFetch = (customFetch?: Fetch): Fetch => {
	let _fetch: Fetch;
	if (customFetch) {
		_fetch = customFetch;
	} else if (typeof fetch === 'undefined') {
		_fetch = crossFetch as unknown as Fetch;
	} else {
		_fetch = fetch;
	}
	return (...args) => _fetch(...args);
};

export const resolveHeadersConstructor = () => {
	if (typeof Headers === 'undefined') {
		return CrossFetchHeaders;
	}

	return Headers;
};

export const fetchWrapper = (customFetch?: Fetch): Fetch => {
	const fetch = resolveFetch(customFetch);
	const HeadersConstructor = resolveHeadersConstructor();

	return async (input, init) => {
		const headers = new HeadersConstructor(init?.headers);

		return fetch(input, { ...init, headers });
	};
};
