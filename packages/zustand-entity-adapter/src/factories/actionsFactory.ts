import {
  EntityId,
  IdSelector,
  Comparer,
  Empty,
  EntityActions,
  EntityState,
  Update,
  SetState,
} from "../models";

const EMPTY_ENTITY_STATE: EntityState<never, never> = { ids: [], entities: {} };

function getSortedIds<Entity, Id extends EntityId>(
  entities: EntityState<Entity, Id>["entities"],
  idSelector: IdSelector<Entity, Id>,
  sorter: Comparer<Entity>,
): Id[] {
  const entitiesList: Entity[] = Object.values(entities).filter(
    (value): value is Entity => !!value,
  );

  entitiesList.sort(sorter);

  const sortedIds = entitiesList.map(idSelector);

  return sortedIds;
}

declare const process: Record<string, Partial<Record<string, string>>>;

function defaultIdSelector<Id extends EntityId>(entity: { id?: Id }): Id {
  if (process.env.NODE_ENV !== "production" && entity.id === undefined) {
    console.warn(
      "The entity passed to the `selectId` implementation returned undefined.",
      "You should probably provide your own `selectId` implementation.",
      "The entity that was passed:",
      entity,
    );
  }

  // Disabling this because we are warning earlier when this happens.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return entity.id!;
}

interface ActionsFactoryOptions<Entity extends object, Id extends EntityId> {
  idSelector?: IdSelector<Entity, Id>;
  sort?: Comparer<Entity> | false;
  setState: SetState<Entity, Empty, Id>;
}

export function actionsFactory<Entity extends object, Id extends EntityId>({
  setState,
  idSelector = defaultIdSelector,
  sort = false,
}: ActionsFactoryOptions<Entity, Id>): EntityActions<Entity, Id> {
  type State = EntityState<Entity, Id>;

  const addOne = (state: State, entity: Entity): State => {
    const id = idSelector(entity);

    if (state.ids.includes(id)) {
      return state;
    }

    return setOne(state, entity);
  };

  const setOne = (state: State, entity: Entity): State => {
    const id = idSelector(entity);
    const isIdIncluded = state.ids.includes(id);

    const entities = {
      ...state.entities,
      [id]: entity,
    };

    const ids =
      isIdIncluded ? state.ids
      : sort ? getSortedIds(entities, idSelector, sort)
      : [...state.ids, id];

    return {
      entities,
      ids,
    };
  };

  const updateOne = (
    state: State,
    { id, update }: Update<Entity, Id>,
  ): State => {
    const entity = state.entities[id];

    if (!entity) {
      return state;
    }

    const entities = {
      ...state.entities,
      [id]: { ...entity, ...update },
    };

    const ids = sort ? getSortedIds(entities, idSelector, sort) : state.ids;

    return {
      entities,
      ids,
    };
  };

  const upsertOne = (state: State, entity: Entity): State => {
    const id = idSelector(entity);

    const currentEntity = state.entities[id];

    if (!currentEntity) {
      return setOne(state, entity);
    }

    return updateOne(state, { id, update: entity });
  };

  const removeOne = (state: State, entity: Entity): State => {
    const id = idSelector(entity);

    const { [id]: deletedEntity, ...entities } = state.entities;

    const ids = state.ids.filter((v) => v !== id);

    return {
      entities,
      ids,
    } as State;
  };

  return {
    removeAll() {
      setState(EMPTY_ENTITY_STATE);
    },
    addOne(entity) {
      setState((state) => addOne(state, entity));
    },
    addMany(entities) {
      setState((state) => entities.reduce(addOne, state));
    },
    setOne(entity) {
      setState((state) => setOne(state, entity));
    },
    setMany(entities) {
      setState((state) => entities.reduce(setOne, state));
    },
    setAll(entities) {
      setState(() => entities.reduce(setOne, EMPTY_ENTITY_STATE));
    },
    updateOne(entity) {
      setState((state) => updateOne(state, entity));
    },
    updateMany(entities) {
      setState((state) => entities.reduce(updateOne, state));
    },
    upsertOne(entity) {
      setState((state) => upsertOne(state, entity));
    },
    upsertMany(entities) {
      setState((state) => entities.reduce(upsertOne, state));
    },
    removeOne(entity) {
      setState((state) => removeOne(state, entity));
    },
    removeMany(entities) {
      setState((state) => entities.reduce(removeOne, state));
    },
  };
}
