import { Item, ItemInput, ManyItems, OneItem, QueryMany, QueryOne } from '../items';
import { ID } from '../types';
import { TransportRequestOptions } from './transport';

export type ItemsOptions = {
	requestOptions: TransportRequestOptions;
};
/**
 * CRUD at its finest
 */
export interface IItems<T extends Item> {
	createOne<Q extends QueryOne<T>>(item: ItemInput<T>, query?: Q, options?: ItemsOptions): Promise<OneItem<T, Q>>;
	createMany<Q extends QueryOne<T>>(items: ItemInput<T>[], query?: Q, options?: ItemsOptions): Promise<ManyItems<T, Q>>;

	readOne<Q extends QueryOne<T>>(id: ID, query?: Q, options?: ItemsOptions): Promise<OneItem<T, Q>>;
	readMany<Q extends QueryMany<T>>(ids: ID[], query?: Q, options?: ItemsOptions): Promise<ManyItems<T, Q>>;
	readByQuery<Q extends QueryMany<T>>(query?: Q, options?: ItemsOptions): Promise<ManyItems<T, Q>>;

	updateOne<Q extends QueryOne<T>>(
		id: ID,
		item: ItemInput<T>,
		query?: Q,
		options?: ItemsOptions
	): Promise<OneItem<T, Q>>;
	updateMany<Q extends QueryMany<T>>(
		ids: ID[],
		item: ItemInput<T>,
		query?: Q,
		options?: ItemsOptions
	): Promise<ManyItems<T, Q>>;
	updateBatch<Q extends QueryMany<T>>(
		items: ItemInput<T>[],
		query?: Q,
		options?: ItemsOptions
	): Promise<ManyItems<T, Q>>;

	deleteOne(id: ID, options?: ItemsOptions): Promise<void>;
	deleteMany(ids: ID[], options?: ItemsOptions): Promise<void>;
}
