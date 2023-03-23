/**
 * @jest-environment node
 */

import { Directus } from '../../../src/rest';
import { MemoryStorage } from '../../../src/storage';

describe('node sdk', function () {
	const sdk = new Directus('http://example.com');

	it('has storage', function () {
		expect(sdk.storage).toBeInstanceOf(MemoryStorage);
	});
});
