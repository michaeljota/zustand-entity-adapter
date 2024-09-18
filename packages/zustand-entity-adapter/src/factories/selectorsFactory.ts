import { EntityState, EntityId, EntitySelectors } from "~models";

export function selectorsFactory<
  Entity,
  Id extends EntityId,
>(): EntitySelectors<Entity, Id> {
  type State = EntityState<Entity, Id>;

  const selectIds = (state: State) => state.ids;
  const selectEntities = (state: State) => state.entities;
  const selectTotal = (state: State) => state.ids.length;

  const selectAll = ({ entities, ids }: State) =>
    ids.reduce((all: Entity[], id): Entity[] => {
      const entity = entities[id];
      if (entity) {
        all.push(entity);
      }
      return all;
    }, []);

  function selectById(id: Id): (state: State) => Entity | undefined;
  function selectById(id: Id, state: State): Entity | undefined;
  function selectById(
    id: Id,
    state?: State,
  ): Entity | undefined | ((state: State) => Entity | undefined) {
    if (!state) {
      return (state: State) => selectById(id, state);
    }

    return state.entities[id];
  }

  return {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
    selectById,
  };
}
