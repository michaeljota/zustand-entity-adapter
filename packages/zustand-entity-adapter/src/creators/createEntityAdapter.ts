import { stateFactory, actionsFactory, selectorsFactory } from "~factories";
import {
  Comparer,
  EntityAdapter,
  EntityId,
  IdSelector,
  SetState,
} from "~models";

export interface EntityAdapterOptions<
  Entity extends object,
  Id extends EntityId,
  > {
    /**
     * The id selector. Useful when you have a property that's not `id` to uniquely identify an
     * object in the collection.
     */
    idSelector?: IdSelector<Entity, Id>;
    /**
     * The sort function to be used.
     */
    sort?: Comparer<Entity>;
}

export function createEntityAdapter<
  Entity extends object,
  Id extends EntityId,
>({ idSelector, sort }: EntityAdapterOptions<Entity, Id> = {}): EntityAdapter<
  Entity,
  Id
> {
  return {
    getState() {
      return stateFactory<Entity, Id>();
    },
    getActions(setState: SetState<Entity, object, Id>) {
      return actionsFactory({ setState, idSelector, sort });
    },
    getSelectors() {
      return selectorsFactory<Entity, Id>();
    },
  };
}
