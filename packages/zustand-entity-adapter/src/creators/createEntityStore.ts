import { create } from "zustand";
import {
  ActionsCreator,
  Empty,
  EntityId,
  ExtraStateCreator,
  ExtractEntityId,
  StoreActions,
  StoreState,
  UseBoundEntityStore,
} from "~models";
import {
  createEntityAdapter,
  EntityAdapterOptions,
} from "./createEntityAdapter";

type EntityAdapterOptionsSortOnly<
  Entity extends object,
  Id extends EntityId,
> = Pick<EntityAdapterOptions<Entity, Id>, "sort">;

type EntityAdapterOptionsWithRequiredIdSelector<
  Entity extends object,
  Id extends EntityId,
> = EntityAdapterOptions<Entity, Id> &
  Required<Pick<EntityAdapterOptions<Entity, Id>, "idSelector">>;

/**
 * Creates an entity store using a default ID selector, selecting the id property of the Entity.
 *
 * @template Entity The entity that will be managed by the store. An id property is required for that entity.
 * The type of that id property will be used to type the actions and selectors that require an id.
 *
 * @param options The options to be passed to the EntityAdapter.
 */
export function createEntityStore<Entity extends { id: EntityId }>(
  options?: EntityAdapterOptionsSortOnly<Entity, ExtractEntityId<Entity>>,
): UseBoundEntityStore<Entity, Empty, Empty, ExtractEntityId<Entity>>;

/**
 * Creates an entity store using a default ID selector, selecting the id property of the Entity, and allowing
 * for an additional extra state to be created and added in the store.
 *
 * @template Entity The entity that will be managed by the store. An id property is required for that entity.
 * The type of that id property will be used to type the actions and selectors that require an id.
 * @template ExtraState The extra state that will be managed by the store.
 *
 * @param stateCreator The extra state creator function. Will be called to generate the extra state that will be
 * managed by the store.
 */
export function createEntityStore<
  Entity extends { id: EntityId },
  ExtraState extends object,
>(
  stateCreator: ExtraStateCreator<ExtraState>,
): UseBoundEntityStore<Entity, ExtraState, Empty, ExtractEntityId<Entity>>;

/**
 * Creates an entity store using a default ID selector, selecting the id property of the Entity, allowing
 * for an additional extra state to be created and added in the store, and allowing for actions to be
 * generated.
 *
 * @template Entity The entity that will be managed by the store. An id property is required for that entity.
 * The type of that id property will be used to type the actions and selectors that require an id.
 * @template ExtraState The extra state that will be managed by the store.
 * @template ExtraActions The extra actions that will be generated for the store.
 *
 * @param stateCreator The extra state creator function. Will be called to generate the extra state that will be
 * managed by the store.
 * @param actionsCreator The extra actions creator function. Will be called to generate the extra actions.
 */
export function createEntityStore<
  Entity extends { id: EntityId },
  ExtraState extends object,
  ExtraActions extends object,
>(
  stateCreator: ExtraStateCreator<ExtraState>,
  actionsCreator: ActionsCreator<ExtraState, ExtraActions>,
): UseBoundEntityStore<
  Entity,
  ExtraState,
  ExtraActions,
  ExtractEntityId<Entity>
>;

/**
 * Creates an entity store using a default ID selector, selecting the id property of the Entity, allowing
 * for an additional extra state to be created and added in the store.
 *
 * @template Entity The entity that will be managed by the store. An id property is required for that entity.
 * The type of that id property will be used to type the actions and selectors that require an id.
 * @template ExtraState The extra state that will be managed by the store.
 *
 * @param options The options to be passed to the EntityAdapter.
 * @param stateCreator The extra state creator function. Will be called to generate the extra state that will be
 * managed by the store.
 */
export function createEntityStore<
  Entity extends { id: EntityId },
  ExtraState extends object,
>(
  options: EntityAdapterOptionsSortOnly<Entity, ExtractEntityId<Entity>>,
  stateCreator: ExtraStateCreator<ExtraState>,
): UseBoundEntityStore<Entity, ExtraState, Empty, ExtractEntityId<Entity>>;

/**
 * Creates an entity store using a default ID selector, selecting the id property of the Entity, allowing
 * for an additional extra state and actions to be created and added in the store.
 *
 * @template Entity The entity that will be managed by the store. An id property is required for that entity.
 * The type of that id property will be used to type the actions and selectors that require an id.
 * @template ExtraState The extra state that will be managed by the store.
 * @template ExtraActions The extra actions that will be generated for the store.
 *
 * @param options The options to be passed to the EntityAdapter.
 * @param stateCreator The extra state creator function. Will be called to generate the extra state that will be
 * managed by the store.
 * @param actionsCreator The extra actions creator function. Will be called to generate the extra actions.
 */
export function createEntityStore<
  Entity extends { id: EntityId },
  ExtraState extends object,
  ExtraActions extends object,
>(
  options: EntityAdapterOptionsSortOnly<Entity, ExtractEntityId<Entity>>,
  stateCreator: ExtraStateCreator<ExtraState>,
  actionsCreator: ActionsCreator<ExtraState, ExtraActions>,
): UseBoundEntityStore<
  Entity,
  ExtraState,
  ExtraActions,
  ExtractEntityId<Entity>
>;

/**
 * Creates an entity store using a user defined ID selector.
 *
 * @template Entity The entity that will be managed by the store.
 * @template Id The type of the ID property in the entity collection.
 *
 * @param options The options argument for the adapter, with the defined ID selector
 * and an optional sort function.
 */
export function createEntityStore<Entity extends object, Id extends EntityId>(
  options: EntityAdapterOptionsWithRequiredIdSelector<Entity, Id>,
): UseBoundEntityStore<Entity, Empty, Empty, Id>;

/**
 * Creates an entity store using a user defined ID selector, allowing for an additional extra
 * state to be created and added in the store.
 *
 * @template Entity The entity that will be managed by the store.
 * @template Id The type of the ID property in the entity collection.
 * @template ExtraState The extra state that will be managed by the store.
 *
 * @param options The options argument for the adapter, with the defined ID selector
 * and an optional sort function.
 * @param stateCreator The extra state creator function. Will be called to generate the extra state that will be
 * managed by the store.
 */
export function createEntityStore<
  Entity extends object,
  Id extends EntityId,
  ExtraState extends object,
>(
  options: EntityAdapterOptionsWithRequiredIdSelector<Entity, Id>,
  stateCreator: ExtraStateCreator<ExtraState>,
): UseBoundEntityStore<Entity, ExtraState, Empty, Id>;

/**
 * Creates an entity store using a user defined ID selector, allowing for an additional extra
 * state and actions to be created and added in the store.
 *
 * @template Entity The entity that will be managed by the store.
 * @template Id The type of the ID property in the entity collection.
 * @template ExtraState The extra state that will be managed by the store.
 * @template ExtraActions The extra actions that will be generated for the store.
 *
 * @param options The options argument for the adapter, with the defined ID selector
 * and an optional sort function.
 * @param stateCreator The extra state creator function. Will be called to generate the extra state that will be
 * managed by the store.
 * @param actionsCreator The extra actions creator function. Will be called to generate the extra actions.
 */
export function createEntityStore<
  Entity extends object,
  Id extends EntityId,
  ExtraState extends object,
  ExtraActions extends object,
>(
  options: EntityAdapterOptionsWithRequiredIdSelector<Entity, Id>,
  stateCreator: ExtraStateCreator<ExtraState>,
  actionsCreator: ActionsCreator<ExtraState, ExtraActions>,
): UseBoundEntityStore<Entity, ExtraState, ExtraActions, Id>;
export function createEntityStore<
  Entity extends object,
  Id extends EntityId,
  ExtraState extends object,
  ExtraActions extends object,
>(
  optionsOrStateCreator?:
    | EntityAdapterOptions<Entity, Id>
    | ExtraStateCreator<ExtraState>,
  stateCreatorOrActionsCreator?:
    | ExtraStateCreator<ExtraState>
    | ActionsCreator<ExtraState, ExtraActions>,
  maybeActionsCreator?: ActionsCreator<ExtraState, ExtraActions>,
): UseBoundEntityStore<Entity, ExtraState, ExtraActions, Id> {
  type State = StoreState<Entity, ExtraState, Id>;
  type Actions = StoreActions<Entity, ExtraState, ExtraActions, Id>;

  const [options, stateCreator, actionsCreator] = parseOptions(
    optionsOrStateCreator,
    stateCreatorOrActionsCreator,
    maybeActionsCreator,
  );

  const entityAdapter = createEntityAdapter<Entity, Id>(options);
  const useStore = create(
    () =>
      ({
        ...entityAdapter.getState(),
        ...stateCreator?.(),
      }) as State,
  );

  return Object.assign(useStore, {
    selectors: entityAdapter.getSelectors(),
    actions: {
      ...entityAdapter.getActions(useStore.setState),
      ...actionsCreator?.(useStore.setState, useStore.getState, useStore),
    } as Actions,
  });
}

function parseOptions<
  Entity extends object,
  Id extends EntityId,
  ExtraState extends object,
  ExtraActions extends object,
>(
  optionsOrStateCreator?:
    | EntityAdapterOptions<Entity, Id>
    | ExtraStateCreator<ExtraState>,
  stateCreatorOrActionsCreator?:
    | ExtraStateCreator<ExtraState>
    | ActionsCreator<ExtraState, ExtraActions>,
  maybeActionsCreator?: ActionsCreator<ExtraState, ExtraActions>,
): [
  EntityAdapterOptions<Entity, Id> | undefined,
  ExtraStateCreator<ExtraState> | undefined,
  ActionsCreator<ExtraState, ExtraActions> | undefined,
] {
  let stateCreator: ExtraStateCreator<ExtraState> | undefined;
  let actionsCreator: ActionsCreator<ExtraState, ExtraActions> | undefined;

  if (typeof optionsOrStateCreator === "function") {
    stateCreator = optionsOrStateCreator;
    actionsCreator = stateCreatorOrActionsCreator as ActionsCreator<
      ExtraState,
      ExtraActions
    >;
    return [undefined, stateCreator, actionsCreator];
  }

  stateCreator = stateCreatorOrActionsCreator as ExtraStateCreator<ExtraState>;
  actionsCreator = maybeActionsCreator;

  return [optionsOrStateCreator, stateCreator, actionsCreator];
}
