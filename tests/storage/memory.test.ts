/**
 * ../../srcjest-environment node
 */

import { MemoryStorage } from '../../src/storage';
import { createStorageTests } from './tests';

describe(
	'memory storage',
	createStorageTests(() => new MemoryStorage())
);
