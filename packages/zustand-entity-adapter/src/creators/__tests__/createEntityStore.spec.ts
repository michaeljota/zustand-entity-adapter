import { createEntityStore } from "../createEntityStore";
import { EntityId } from "~models";

describe("createEntityStore", () => {
  interface Entity {
    id: string;
    name: string;
  }
  interface ExtraState {
    loading: boolean;
  }
  interface ExtraActions {
    toggleLoading: () => void;
  }

  const entity1 = { id: "1", name: "Entity 1" };
  const entity2 = { id: "2", name: "Entity 2" };

  it("should create a store with default ID selector", () => {
    const store = createEntityStore<Entity>();

    expect(store.getState()).toEqual({
      ids: [],
      entities: {},
    });
  });

  it("should create a store with extra state", () => {
    const store = createEntityStore<Entity, ExtraState>(() => ({
      loading: false,
    }));

    expect(store.getState()).toEqual({
      ids: [],
      entities: {},
      loading: false,
    });
  });

  it("should create a store with extra state and extra actions", () => {
    const store = createEntityStore<Entity, ExtraState, ExtraActions>(
      () => ({ loading: false }),
      (set) => ({
        toggleLoading: () =>
          set((state) => ({ ...state, loading: !state.loading })),
      }),
    );

    expect(store.getState()).toEqual({
      ids: [],
      entities: {},
      loading: false,
    });

    store.actions.toggleLoading();
    expect(store.getState().loading).toBe(true);
  });

  it("should create a store with custom ID selector", () => {
    const store = createEntityStore<Entity, EntityId>({
      idSelector: (entity) => entity.name,
    });

    store.actions.addOne(entity1);

    expect(store.getState().entities[entity1.name]).toEqual(entity1);
    expect(store.getState().ids).toContain(entity1.name);
  });

  it("should sort entities when adding them if sort function is provided", () => {
    const store = createEntityStore<Entity, EntityId>({
      idSelector: (entity) => entity.id,
      sort: (a, b) => a.name.localeCompare(b.name),
    });

    store.actions.addMany([entity2, entity1]);

    expect(store.getState().ids).toEqual([entity1.id, entity2.id]); // Sorted by name
  });

  it("should replace existing entity when setOne is called", () => {
    const store = createEntityStore<Entity>();

    store.actions.addOne(entity1);
    store.actions.setOne({ id: "1", name: "Updated Entity 1" });

    expect(store.getState().entities["1"]).toEqual({
      id: "1",
      name: "Updated Entity 1",
    });
  });

  it("should not update state if addOne is called with an existing entity", () => {
    const store = createEntityStore<Entity>();

    store.actions.addOne(entity1);
    const initialState = store.getState();

    store.actions.addOne(entity1); // Trying to add same entity

    expect(store.getState()).toEqual(initialState); // State should remain unchanged
  });

  it("should not update state if updateOne is called with a non-existing entity", () => {
    const store = createEntityStore<Entity>();

    const initialState = store.getState();

    store.actions.updateOne({ id: "3", update: { name: "Non-Existent" } });

    expect(store.getState()).toEqual(initialState); // State should remain unchanged
  });

  it("should remove an entity when removeOne is called", () => {
    const initialState = {
      entities: {
        "1": entity1,
        "2": entity2,
      },
      ids: ["1", "2"],
    };
    const store = createEntityStore<Entity>();
    store.setState(initialState, true);

    store.actions.removeOne(entity1);

    expect(store.getState().entities[entity1.id]).toBeUndefined();
    expect(store.getState().entities).toEqual({
      "2": entity2,
    });
    expect(store.getState().ids).not.toContain(entity1.id);
  });

  it("should not update state if removeOne is called with a non-existing entity", () => {
    const initialState = {
      entities: {
        "1": entity1,
      },
      ids: ["1"],
    };
    const store = createEntityStore<Entity>();

    store.setState(initialState, true);

    store.actions.removeOne(entity2);

    expect(store.getState()).toEqual(initialState); // State should remain unchanged
  });
});
