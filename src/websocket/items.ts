import { Item, ItemInput, ManyItems, OneItem, QueryMany, QueryOne } from '../items';
import { ID } from '../types';

export interface IItems<T extends Item> {
	createOne<Q extends QueryOne<T>>(item: ItemInput<T>, query?: Q): Promise<OneItem<T, Q>>;
	createMany<Q extends QueryOne<T>>(items: ItemInput<T>[], query?: Q): Promise<ManyItems<T, Q>>;

	readOne<Q extends QueryOne<T>>(id: ID, query?: Q): Promise<OneItem<T, Q>>;
	readMany<Q extends QueryMany<T>>(ids: ID[], query?: Q): Promise<ManyItems<T, Q>>;
	readByQuery<Q extends QueryMany<T>>(query?: Q): Promise<ManyItems<T, Q>>;

	updateOne<Q extends QueryOne<T>>(id: ID, item: ItemInput<T>, query?: Q): Promise<OneItem<T, Q>>;
	updateMany<Q extends QueryMany<T>>(ids: ID[], item: ItemInput<T>, query?: Q): Promise<ManyItems<T, Q>>;
	updateBatch<Q extends QueryMany<T>>(items: ItemInput<T>[], query?: Q): Promise<ManyItems<T, Q>>;

	deleteOne(id: ID): Promise<void>;
	deleteMany(ids: ID[]): Promise<void>;
}
