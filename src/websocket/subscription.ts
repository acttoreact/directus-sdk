import { DefaultItem, Item, PickedDefaultItem, QueryFields, QueryMany, QueryOne } from '../items';
import { ID } from '../types';

export type SubscriptionItem<
	T extends Item,
	Q extends QueryOne<T> = Record<'fields', undefined>,
	F extends string[] | false = QueryFields<Q>
> = (F extends false ? DefaultItem<T> : PickedDefaultItem<T, F>) | null | undefined;

export type SubscriptionResponse<T> = {
	event: 'init' | 'create' | 'update' | 'delete';
	payload: T;
};

export interface ISubscription<T extends Item> {
	all<Q extends QueryOne<T>>(
		callback: (data: SubscriptionResponse<SubscriptionItem<T, Q>[]>) => void,
		query?: Q
	): () => void;
	one<Q extends QueryOne<T>>(
		id: ID,
		callback: (data: SubscriptionResponse<SubscriptionItem<T, Q>[]>) => void,
		query?: Q
	): () => void;
	many<Q extends QueryMany<T>>(
		ids: ID[],
		callback: (data: SubscriptionResponse<SubscriptionItem<T, Q>[]>) => void,
		query?: Q
	): () => void;
	byQuery<Q extends QueryMany<T>>(
		query: Q,
		callback: (data: SubscriptionResponse<SubscriptionItem<T, Q>[]>) => void
	): () => void;
}
