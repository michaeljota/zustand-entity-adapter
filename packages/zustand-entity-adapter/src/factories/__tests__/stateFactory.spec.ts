import { stateFactory } from "./../stateFactory";
import { EntityState } from "~models";

describe("stateFactory", () => {
  interface Entity {
    id: string;
    name: string;
  }
  type Id = string;

  it("should return an empty EntityState", () => {
    const result: EntityState<Entity, Id> = stateFactory<Entity, Id>();

    expect(result).toEqual({
      ids: [],
      entities: {},
    });
  });

  it("should initialize an EntityState with empty ids array", () => {
    const result: EntityState<Entity, Id> = stateFactory<Entity, Id>();

    expect(result.ids).toEqual([]);
  });

  it("should initialize an EntityState with an empty entities object", () => {
    const result: EntityState<Entity, Id> = stateFactory<Entity, Id>();

    expect(result.entities).toEqual({});
  });
});
