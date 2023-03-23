/**
 * @jest-environment jsdom
 */

import { LocalStorage } from '../../src/storage';
import { createStorageTests } from './tests';

describe(
	'localstorage storage',
	createStorageTests(() => new LocalStorage())
);
