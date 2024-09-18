import { create } from "zustand";
import { actionsFactory } from "./../actionsFactory";
import { EntityActions, EntityState } from "~models";

const EMPTY_ENTITY_STATE = { ids: [], entities: {} };

describe("actionsFactory", () => {
  describe("with default id selector and sorting disabled", () => {
    const testStore = create<EntityState<{ id: string }, string>>(
      () => EMPTY_ENTITY_STATE,
    );
    let actions: EntityActions<{ id: string; name?: string }, string>;

    beforeEach(() => {
      testStore.setState(EMPTY_ENTITY_STATE, true);

      actions = actionsFactory({
        setState: testStore.setState,
      });
    });

    it("should add an entity with addOne", () => {
      const entity = { id: "1", name: "Entity 1" };

      actions.addOne(entity);

      expect(testStore.getState()).toEqual({
        ids: ["1"],
        entities: { "1": entity },
      });
    });

    it("should not update state when adding an entity with an existing id using addOne", () => {
      const existingEntity = { id: "1", name: "Existing Entity" };
      const duplicateEntity = { id: "1", name: "Duplicate Entity" };
      const initialState = {
        ids: ["1"],
        entities: { "1": existingEntity },
      };

      testStore.setState(initialState, true);

      actions.addOne(duplicateEntity);

      // The state should not be updated with the duplicate entity
      expect(testStore.getState()).toEqual(initialState);
    });

    it("should set an entity with setOne", () => {
      const entity = { id: "1", name: "Entity 1" };

      actions.setOne(entity);

      expect(testStore.getState()).toEqual({
        ids: ["1"],
        entities: { "1": entity },
      });
    });

    it("should replace an existing entity with setOne", () => {
      const initialEntity = { id: "1", name: "Entity 1" };
      const newEntity = { id: "1", name: "New Entity 1" };
      const initialState = {
        ids: ["1"],
        entities: { "1": initialEntity },
      };

      testStore.setState(initialState, true);

      actions.setOne(newEntity);

      expect(testStore.getState()).toEqual({
        ids: ["1"],
        entities: { "1": newEntity }, // The old entity should be completely replaced
      });
    });

    it("should update an existing entity with updateOne", () => {
      const entity = { id: "1", name: "Entity 1" };
      const updatedEntity = { id: "1", name: "Updated Entity 1" };
      const initialState = {
        ids: ["1"],
        entities: { "1": entity },
      };

      testStore.setState(initialState, true);

      actions.updateOne({ id: "1", update: updatedEntity });

      expect(testStore.getState()).toEqual({
        ids: ["1"],
        entities: { "1": updatedEntity },
      });
    });

    it("should not update state when trying to update an entity that does not exist", () => {
      const nonExistentEntityUpdate = {
        id: "1",
        update: { name: "Non-Existent Entity" },
      };
      const initialState = {
        ids: [],
        entities: {},
      };

      testStore.setState(initialState, true);

      actions.updateOne(nonExistentEntityUpdate);

      // The state should remain the same as no entity with id "1" exists
      expect(testStore.getState()).toEqual(initialState);
    });

    it("should remove an entity with removeOne", () => {
      const entity = { id: "1", name: "Entity 1" };
      const initialState = {
        ids: ["1"],
        entities: { "1": entity },
      };

      testStore.setState(initialState, true);

      actions.removeOne(entity);

      expect(testStore.getState()).toEqual({
        ids: [],
        entities: {},
      });
    });

    it("should not update state when trying to remove an entity that does not exist", () => {
      const nonExistentEntity = { id: "1", name: "Non-Existent Entity" };
      const initialState = {
        ids: ["2"],
        entities: {
          "2": { id: "2", name: "Entity 2" },
        },
      };

      testStore.setState(initialState, true);

      actions.removeOne(nonExistentEntity);

      // The state should remain unchanged as no entity with id "1" exists
      expect(testStore.getState()).toEqual(initialState);
    });

    it("should add multiple entities with addMany", () => {
      const entities = [
        { id: "1", name: "Entity 1" },
        { id: "2", name: "Entity 2" },
      ];

      actions.addMany(entities);

      expect(testStore.getState()).toEqual({
        ids: ["1", "2"],
        entities: {
          "1": entities[0],
          "2": entities[1],
        },
      });
    });

    it("should set multiple entities with setMany", () => {
      const entities = [
        { id: "1", name: "Entity 1" },
        { id: "2", name: "Entity 2" },
      ];

      actions.setMany(entities);

      expect(testStore.getState()).toEqual({
        ids: ["1", "2"],
        entities: {
          "1": entities[0],
          "2": entities[1],
        },
      });
    });

    it("should replace all entities with setAll", () => {
      const entities = [
        { id: "1", name: "Entity 1" },
        { id: "2", name: "Entity 2" },
      ];

      actions.setAll(entities);

      expect(testStore.getState()).toEqual({
        ids: ["1", "2"],
        entities: {
          "1": entities[0],
          "2": entities[1],
        },
      });
    });

    it("should update multiple entities with updateMany", () => {
      const initialEntities = [
        { id: "1", name: "Entity 1" },
        { id: "2", name: "Entity 2" },
      ];
      const updates = [
        { id: "1", update: { name: "Updated Entity 1" } },
        { id: "2", update: { name: "Updated Entity 2" } },
      ];
      const initialState = {
        ids: ["1", "2"],
        entities: {
          "1": initialEntities[0],
          "2": initialEntities[1],
        },
      };

      testStore.setState(initialState, true);

      actions.updateMany(updates);

      expect(testStore.getState()).toEqual({
        ids: ["1", "2"],
        entities: {
          "1": { id: "1", name: "Updated Entity 1" },
          "2": { id: "2", name: "Updated Entity 2" },
        },
      });
    });

    it("should upsert an entity with upsertOne", () => {
      const entity = { id: "1", name: "Entity 1" };
      const updatedEntity = { id: "1", name: "Updated Entity 1" };
      const initialState = {
        ids: ["1"],
        entities: { "1": entity },
      };

      testStore.setState(initialState, true);

      actions.upsertOne(updatedEntity);

      expect(testStore.getState()).toEqual({
        ids: ["1"],
        entities: { "1": updatedEntity },
      });
    });

    it("should upsert multiple entities with upsertMany", () => {
      const entities = [
        { id: "1", name: "Entity 1" },
        { id: "2", name: "Entity 2" },
      ];
      const updatedEntities = [
        { id: "1", name: "Updated Entity 1" },
        { id: "2", name: "Updated Entity 2" },
      ];

      const initialState = {
        ids: ["1", "2"],
        entities: {
          "1": entities[0],
          "2": entities[1],
        },
      };

      testStore.setState(initialState, true);

      actions.upsertMany(updatedEntities);

      expect(testStore.getState()).toEqual({
        ids: ["1", "2"],
        entities: {
          "1": updatedEntities[0],
          "2": updatedEntities[1],
        },
      });
    });

    it("should remove multiple entities with removeMany", () => {
      const entities = [
        { id: "1", name: "Entity 1" },
        { id: "2", name: "Entity 2" },
      ];
      const initialState = {
        ids: ["1", "2"],
        entities: {
          "1": entities[0],
          "2": entities[1],
        },
      };

      testStore.setState(initialState, true);

      actions.removeMany(entities);

      expect(testStore.getState()).toEqual({
        ids: [],
        entities: {},
      });
    });

    it("should clear all entities with removeAll", () => {
      const entities = [
        { id: "1", name: "Entity 1" },
        { id: "2", name: "Entity 2" },
      ];

      const initialState = {
        ids: ["1", "2"],
        entities: {
          "1": entities[0],
          "2": entities[1],
        },
      };

      testStore.setState(initialState, true);

      actions.removeAll();

      expect(testStore.getState()).toEqual(EMPTY_ENTITY_STATE);
    });

    it("should call console.warn when default idSelector is used and entity lacks 'id' property", () => {
      const entityWithoutId = { name: "Entity without ID" };
      const consoleWarnSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(jest.fn());

      // @ts-expect-error We are testing the default selector with entities that doesn't have the default shape.
      actions.addOne(entityWithoutId);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "The entity passed to the `selectId` implementation returned undefined.",
        "You should probably provide your own `selectId` implementation.",
        "The entity that was passed:",
        entityWithoutId,
      );

      consoleWarnSpy.mockRestore();
    });
  });

  // Custom idSelector that uses the "uniqueKey" property instead of "id"
  const customIdSelector = (entity: { uniqueKey: string }) => entity.uniqueKey;

  describe("with custom idSelector", () => {
    const testStore = create<EntityState<{ uniqueKey: string }, string>>(
      () => EMPTY_ENTITY_STATE,
    );
    let actions: EntityActions<{ uniqueKey: string }, string>;

    beforeEach(() => {
      testStore.setState(EMPTY_ENTITY_STATE, true);

      actions = actionsFactory({
        setState: testStore.setState,
        idSelector: customIdSelector,
      });
    });

    it("should add an entity with a custom idSelector (uniqueKey) with addOne", () => {
      const entity = { uniqueKey: "abc123", name: "Entity 1" };

      actions.addOne(entity);

      expect(testStore.getState()).toEqual({
        ids: ["abc123"],
        entities: { abc123: entity },
      });
    });

    it("should update an existing entity using the custom idSelector with updateOne", () => {
      const entity = { uniqueKey: "abc123", name: "Entity 1" };
      const updatedEntity = { uniqueKey: "abc123", name: "Updated Entity 1" };
      const initialState = {
        ids: ["abc123"],
        entities: { abc123: entity },
      };

      testStore.setState(initialState, true);

      actions.updateOne({ id: "abc123", update: updatedEntity });

      expect(testStore.getState()).toEqual({
        ids: ["abc123"],
        entities: { abc123: updatedEntity },
      });
    });

    it("should remove an entity using the custom idSelector with removeOne", () => {
      const entity = { uniqueKey: "abc123", name: "Entity 1" };
      const initialState = {
        ids: ["abc123"],
        entities: { abc123: entity },
      };

      testStore.setState(initialState, true);

      actions.removeOne(entity);

      expect(testStore.getState()).toEqual({
        ids: [],
        entities: {},
      });
    });

    it("should add multiple entities using the custom idSelector with addMany", () => {
      const entities = [
        { uniqueKey: "abc123", name: "Entity 1" },
        { uniqueKey: "def456", name: "Entity 2" },
      ];

      actions.addMany(entities);

      expect(testStore.getState()).toEqual({
        ids: ["abc123", "def456"],
        entities: {
          abc123: entities[0],
          def456: entities[1],
        },
      });
    });

    it("should replace all entities using the custom idSelector with setAll", () => {
      const entities = [
        { uniqueKey: "abc123", name: "Entity 1" },
        { uniqueKey: "def456", name: "Entity 2" },
      ];

      actions.setAll(entities);

      expect(testStore.getState()).toEqual({
        ids: ["abc123", "def456"],
        entities: {
          abc123: entities[0],
          def456: entities[1],
        },
      });
    });

    it("should upsert an entity using the custom idSelector with upsertOne", () => {
      const entity = { uniqueKey: "abc123", name: "Entity 1" };
      const updatedEntity = { uniqueKey: "abc123", name: "Updated Entity 1" };
      const initialState = {
        ids: ["abc123"],
        entities: { abc123: entity },
      };

      testStore.setState(initialState, true);

      actions.upsertOne(updatedEntity);

      expect(testStore.getState()).toEqual({
        ids: ["abc123"],
        entities: { abc123: updatedEntity },
      });
    });

    it("should remove multiple entities using the custom idSelector with removeMany", () => {
      const entities = [
        { uniqueKey: "abc123", name: "Entity 1" },
        { uniqueKey: "def456", name: "Entity 2" },
      ];

      const initialState = {
        ids: ["abc123", "def456"],
        entities: {
          abc123: entities[0],
          def456: entities[1],
        },
      };

      testStore.setState(initialState, true);

      actions.removeMany(entities);

      expect(testStore.getState()).toEqual({
        ids: [],
        entities: {},
      });
    });

    it("should clear all entities using the custom idSelector with removeAll", () => {
      const entities = [
        { uniqueKey: "abc123", name: "Entity 1" },
        { uniqueKey: "def456", name: "Entity 2" },
      ];

      const initialState = {
        ids: ["abc123", "def456"],
        entities: {
          abc123: entities[0],
          def456: entities[1],
        },
      };

      testStore.setState(initialState, true);

      actions.removeAll();

      expect(testStore.getState()).toEqual(EMPTY_ENTITY_STATE);
    });
  });

  // Custom sorting function that sorts entities by "name" in alphabetical order
  const customSort = (a: { name: string }, b: { name: string }) =>
    a.name.localeCompare(b.name);

  describe("with sorting", () => {
    const testStore = create<EntityState<{ id: string; name: string }, string>>(
      () => EMPTY_ENTITY_STATE,
    );
    let actions: EntityActions<{ id: string; name: string }, string>;

    beforeEach(() => {
      testStore.setState(EMPTY_ENTITY_STATE, true);

      actions = actionsFactory({
        setState: testStore.setState,
        sort: customSort, // Pass custom sort function
      });
    });

    it("should add entities in sorted order with addOne", () => {
      const entity1 = { id: "1", name: "Zebra" };
      const entity2 = { id: "2", name: "Apple" };

      actions.addOne(entity1);
      actions.addOne(entity2); // Should be placed before "Zebra"

      expect(testStore.getState()).toEqual({
        ids: ["2", "1"], // Sorted by name: Apple first, then Zebra
        entities: {
          "1": entity1,
          "2": entity2,
        },
      });
    });

    it("should add multiple entities in sorted order with addMany", () => {
      const entities = [
        { id: "1", name: "Banana" },
        { id: "2", name: "Apple" },
        { id: "3", name: "Cherry" },
      ];

      actions.addMany(entities);

      expect(testStore.getState()).toEqual({
        ids: ["2", "1", "3"], // Sorted by name: Apple, Banana, Cherry
        entities: {
          "1": entities[0],
          "2": entities[1],
          "3": entities[2],
        },
      });
    });

    it("should update entities and maintain sorted order with updateOne", () => {
      const entity1 = { id: "1", name: "Banana" };
      const entity2 = { id: "2", name: "Apple" };
      const initialState = {
        ids: ["2", "1"],
        entities: {
          "1": entity1,
          "2": entity2,
        },
      };

      testStore.setState(initialState, true);

      const updatedEntity = { id: "1", name: "Zebra" }; // Change Banana to Zebra

      actions.updateOne({ id: "1", update: updatedEntity });

      expect(testStore.getState()).toEqual({
        ids: ["2", "1"], // Sorted remains: Apple, then Zebra (updated Banana)
        entities: {
          "1": updatedEntity,
          "2": entity2,
        },
      });
    });

    it("should set all entities in sorted order with setAll", () => {
      const entities = [
        { id: "1", name: "Banana" },
        { id: "2", name: "Apple" },
        { id: "3", name: "Cherry" },
      ];

      actions.setAll(entities);

      expect(testStore.getState()).toEqual({
        ids: ["2", "1", "3"], // Sorted by name: Apple, Banana, Cherry
        entities: {
          "1": entities[0],
          "2": entities[1],
          "3": entities[2],
        },
      });
    });

    it("should upsert an entity and maintain sorted order with upsertOne", () => {
      const entity1 = { id: "1", name: "Banana" };
      const entity2 = { id: "2", name: "Apple" };
      const initialState = {
        ids: ["2", "1"],
        entities: {
          "1": entity1,
          "2": entity2,
        },
      };

      testStore.setState(initialState, true);

      const updatedEntity = { id: "3", name: "Cherry" };

      actions.upsertOne(updatedEntity); // Adding Cherry

      expect(testStore.getState()).toEqual({
        ids: ["2", "1", "3"], // Sorted by name: Apple, Banana, Cherry
        entities: {
          "1": entity1,
          "2": entity2,
          "3": updatedEntity,
        },
      });
    });

    it("should upsert multiple entities and maintain sorted order with upsertMany", () => {
      const entities = [
        { id: "1", name: "Banana" },
        { id: "2", name: "Apple" },
      ];
      const initialState = {
        ids: ["2", "1"],
        entities: {
          "1": entities[0],
          "2": entities[1],
        },
      };

      testStore.setState(initialState, true);

      const updatedEntities = [
        { id: "1", name: "Zebra" }, // Update Banana to Zebra
        { id: "3", name: "Cherry" }, // Add Cherry
      ];

      actions.upsertMany(updatedEntities);

      expect(testStore.getState()).toEqual({
        ids: ["2", "3", "1"], // Sorted by name: Apple, Cherry, Zebra
        entities: {
          "1": updatedEntities[0], // Zebra (updated)
          "2": entities[1], // Apple
          "3": updatedEntities[1], // Cherry (added)
        },
      });
    });
  });
});
