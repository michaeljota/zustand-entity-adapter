import { UseBoundStore, StoreApi, StateCreator } from "zustand";

export type EntityId = string | number;

type Dictionary<Entity, Id extends EntityId> = Partial<Record<Id, Entity>>;

export interface EntityState<Entity, Id extends EntityId> {
  ids: Id[];
  entities: Dictionary<Entity, Id>;
}

export interface Update<Entity, Id extends EntityId> {
  id: Id;
  update: Partial<Entity>;
}

export interface EntityAdapter<Entity extends object, Id extends EntityId> {
  getState(): EntityState<Entity, Id>;
  getActions(setState: SetState<Entity, Empty, Id>): EntityActions<Entity, Id>;
  getSelectors(): EntitySelectors<Entity, Id>;
}

export interface EntityActions<Entity, Id extends EntityId> {
  /**
   * Add one entity to the collection, if that entity doesn't exist already.
   */
  addOne(entity: Entity): void;
  /**
   * Add a list of entities to the collection, if they don't already exist.
   */
  addMany(entities: Entity[]): void;
  /**
   * Add one entity to the collection, replacing any existing entity with the same id.
   */
  setOne(entity: Entity): void;
  /**
   * Add a list of entities to the collection, replacing any existing entity with the same id.
   */
  setMany(entities: Entity[]): void;
  /**
   * Replace all entities in the collection with the list of entities.
   */
  setAll(entities: Entity[]): void;
  /**
   * Applies a partial update in an entity searched by the `id` property, if the entity searched exists.
   */
  updateOne(update: Update<Entity, Id>): void;
  /**
   * Applies a partial update in each entity searched by the `id` property, if the entity searched exists.
   */
  updateMany(updates: Update<Entity, Id>[]): void;
  /**
   * Replaces an entity if the entity exists, or inserts it.
   */
  upsertOne(entity: Entity): void;
  /**
   * Replaces each entity if each entity exists, or inserts it.
   */
  upsertMany(entities: Entity[]): void;
  /**
   * Removes a list of entities from the collection.
   */
  removeMany(entities: Entity[]): void;
  /**
   * Removes an entity from the collection.
   */
  removeOne(entity: Entity): void;
  /**
   * Removes all entities from the collection.
   */
  removeAll(): void;
}

export interface EntitySelectors<
  Entity,
  Id extends EntityId,
  State extends EntityState<Entity, Id> = EntityState<Entity, Id>,
> {
  /**
   *
   * @param state
   */
  selectIds(state: State): EntityId[];
  selectEntities(state: State): Dictionary<Entity, Id>;
  selectAll(state: State): Entity[];
  selectTotal(state: State): number;
  selectById(id: EntityId): (state: State) => Entity | undefined;
  selectById(id: EntityId, state: State): Entity | undefined;
}

export type UseBoundEntityStore<
  Entity extends object,
  ExtraState extends object,
  ExtraActions extends object,
  Id extends EntityId,
> = BoundEntityStore<Entity, ExtraState, Id> & {
  actions: StoreActions<Entity, ExtraState, ExtraActions, Id>;
  selectors: EntitySelectors<Entity, Id>;
};

export type StoreState<
  Entity extends object,
  ExtraState extends object,
  Id extends EntityId,
> = EntityState<Entity, Id> & ExtraState;

export type StoreActions<
  Entity extends object,
  ExtraState extends object,
  ExtraActions extends object,
  Id extends EntityId,
> = EntityActions<Entity, Id> &
  ReturnType<StateCreator<ExtraState, [], [], ExtraActions>>;

type BoundEntityStore<
  Entity extends object,
  ExtraState extends object,
  Id extends EntityId,
> = UseBoundStore<StoreApi<StoreState<Entity, ExtraState, Id>>>;

export type SetState<
  Entity extends object,
  ExtraState extends object,
  Id extends EntityId,
> = BoundEntityStore<Entity, ExtraState, Id>["setState"];

export type Comparer<Entity> = (a: Entity, b: Entity) => number;

export type IdSelector<Entity, Id extends EntityId> = (model: Entity) => Id;

export type ExtractEntityId<Entity> =
  Entity extends { id: infer Id } ? Id : never;

export type ActionsCreator<
  ExtraState extends object,
  ExtraActions extends object,
> = StateCreator<ExtraState, [], [], ExtraActions>;

export type ExtraStateCreator<ExtraState> = () => ExtraState;

export type Empty = Record<never, never>;
