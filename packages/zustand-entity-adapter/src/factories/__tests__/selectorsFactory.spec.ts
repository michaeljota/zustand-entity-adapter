import { selectorsFactory } from "./../selectorsFactory";
import { EntityState } from "~models";

describe("selectorsFactory", () => {
  interface Entity {
    id: string;
    name: string;
  }
  type Id = string;

  const initialState: EntityState<Entity, Id> = {
    ids: ["1", "2"],
    entities: {
      "1": { id: "1", name: "Entity 1" },
      "2": { id: "2", name: "Entity 2" },
    },
  };

  const selectors = selectorsFactory<Entity, Id>();

  it("should select ids using selectIds", () => {
    const result = selectors.selectIds(initialState);
    expect(result).toEqual(["1", "2"]);
  });

  it("should select entities using selectEntities", () => {
    const result = selectors.selectEntities(initialState);
    expect(result).toEqual({
      "1": { id: "1", name: "Entity 1" },
      "2": { id: "2", name: "Entity 2" },
    });
  });

  it("should select total number of entities using selectTotal", () => {
    const result = selectors.selectTotal(initialState);
    expect(result).toEqual(2);
  });

  it("should select all entities using selectAll", () => {
    const result = selectors.selectAll(initialState);
    expect(result).toEqual([
      { id: "1", name: "Entity 1" },
      { id: "2", name: "Entity 2" },
    ]);
  });

  it("should select an entity by id using selectById (with state)", () => {
    const result = selectors.selectById("1", initialState);
    expect(result).toEqual({ id: "1", name: "Entity 1" });
  });

  it("should return undefined if entity id does not exist using selectById (with state)", () => {
    const result = selectors.selectById("3", initialState);
    expect(result).toBeUndefined();
  });

  it("should return a function when selectById is called without state", () => {
    const selectByIdFn = selectors.selectById("1");
    expect(typeof selectByIdFn).toBe("function");

    const result = selectByIdFn(initialState);
    expect(result).toEqual({ id: "1", name: "Entity 1" });
  });

  it("should return undefined when using the returned function from selectById for a non-existing id", () => {
    const selectByIdFn = selectors.selectById("3");
    expect(typeof selectByIdFn).toBe("function");

    const result = selectByIdFn(initialState);
    expect(result).toBeUndefined();
  });
});
