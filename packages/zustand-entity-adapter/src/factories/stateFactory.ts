import { EntityId, EntityState } from "~models";

export function stateFactory<Entity, Id extends EntityId>(): EntityState<
  Entity,
  Id
> {
  return { ids: [], entities: {} };
}
