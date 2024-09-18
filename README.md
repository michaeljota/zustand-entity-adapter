# **Zustand Entity Adapter**

A really small (~3kb/~1kb gziped) library to create an Entity Adapter[¹](https://ngrx.io/guide/entity)[²](https://redux-toolkit.js.org/api/createEntityAdapter) for [Zustand](https://zustand.docs.pmnd.rs/).

It also allows you to create a convenient store that includes any additional structure and the actions and selectors to be used to manage the entities.

## **Table of Contents**

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## **Installation**

To install this library in your project, use npm :

```
npm install zustand-entity-adapter
```

or yarn:

```
yarn add zustand-entity-adapter
```

## **Basic Usage**

Here is a basic example of how to use the library.

### **First create the adapter**

Your adapter provides an API for manipulating and querying a normalized collection of state instances of the same type.
It will allow you to create a normal Zustand store, and additionally to configure the actions and selectors for it.

```ts
import { create } from "zustand";
import { createEntityAdapter } from "zustand-entity-adapter";

// Define the entity
interface User {
  id: number;
  name: string;
}

// Create the entity adapter
const entityAdapter = createEntityAdapter<User, number>();

// Create the entity store
const useUserStore = create(entityAdapter.getState);

// Configure the entity actions
const userActions = entityAdapter.getActions(useUserStore.setState);

// Configure the entity selectors
const userSelectors = entityAdapter.getSelectors();
```

### **Now use it in your components!**

You will be able to use the store as a regular store, and the selectors and actions without any additional binding.

```ts
const UserList: FC = () => {
  const users = useUserStore(userSelectors.selectAll);
  return (
    <ul>
      {users.map((user) => (
        <li>{user.name}</li>
      ))}
    </ul>
  );
};

const AddUserButton: FC<{ user: User }> = ({ user }) => {
  return <button onClick={() => userActions.addOne(user)}>Add user</button>;
};
```

### **Or create an entity store!**

Alternatively, you can create an entity store and enjoy most of this configuration out the box.

```ts
// Create the entity store - One less type argument
const useUserStore = createEntityStore<User>();

// Configure the entity actions - No function calls, only properties
const userActions = useUserStore.actions;

// Configure the entity selectors
const userSelectors = useUserStore.selectors;
```

The store and helpers can be used as described previously.

## **API**

### **`createEntityAdapter<Entity, Id>(options: EntityAdapterOptions<Entity, Id>)`**

Creates an entity adapter for managing a normalized collection of entities of type `Entity`. This adapter provides methods for querying and updating the state, as well as actions for manipulating the entities.

- **Parameters:**

  - `options.idSelector` (optional): A function that returns the entity ID.
  - `options.sort` (optional): A function to sort the entities.

- **Methods:**
  - **_`getState()`_**: Creates and returns the entity state.
  - **_`getActions(setState: SetState)`_**: Returns a set of actions to manipulate the entity state.
  - **_`getSelectors()`_**: Provides selectors to query the state.

#### **Entity Selectors**

The selectors provided by `getSelectors()` are useful for querying the state.

- **_`selectIds(state: State)`_**: Returns an array of entity IDs.
- **_`selectEntities(state: State)`_**: Returns a dictionary of entities by ID.
- **_`selectAll(state: State)`_**: Returns an array of all entities.
- **_`selectTotal(state: State)`_**: Returns the total count of entities.
- **_`selectById(id: Id)`_**: Returns a specific entity by its ID.

#### **Entity Actions**

The actions provided by `getActions()` allow manipulation of entities within the store.

- **_`addOne(entity: Entity)`_**: Adds a new entity to the collection.
- **_`addMany(entities: Entity[])`_**: Adds multiple entities to the collection.
- **_`setOne(entity: Entity)`_**: Replaces an entity in the collection with the provided one.
- **_`setMany(entities: Entity[])`_**: Replaces multiple entities in the collection.
- **_`setAll(entities: Entity[])`_**: Replaces all entities with the provided set.
- **_`updateOne(update: Update<Entity, Id>)`_**: Partially updates a single entity.
- **_`updateMany(updates: Update<Entity, Id>[])`_**: Partially updates multiple entities.
- **_`upsertOne(entity: Entity)`_**: Inserts or updates a single entity.
- **_`upsertMany(entities: Entity[])`_**: Inserts or updates multiple entities.
- **_`removeOne(id: Id)`_**: Removes an entity by its ID.
- **_`removeMany(ids: Id[])`_**: Removes multiple entities by their IDs.
- **_`removeAll()`_**: Removes allentities.

### **`createEntityStore<Entity, ExtraState, ExtraActions, Id>()`**

Creates an entity store using `zustand`, providing a full set of selectors and actions for managing entities.

- **Parameters:**

  - `options?`: (optional) Configuration for sorting or ID selection. The same options the `createEntityAdapter` has.
  - `stateCreator?`: (optional) Function to create additional state in the store.
  - `actionsCreator?`: (optional) Function to create custom actions.

- **Properties:**
  The `createEntityStore` returns a regular Zustand store, with a state to manage the entities, and this properties:

  - `actions`: The actions to manage the entities collection. The result of calling the `EntityAdapter#getActions` method.
  - `selectors`: The selector to query the entities collection. The result of calling the `EntityAdapter#getSelectors` method.

- **Examples:**

  - Basic store creation:

    ```ts
    const useStore = createEntityStore<Entity>();
    ```

  - Store with additional state:

    ```ts
    const useStore = createEntityStore(
      (): EntityState => ({ selectedUser: undefined }),
    );
    ```

  - Store with additional state and custom actions:

    ```ts
    const useStore = createEntityStore(
      (): EntityState => ({
        selectedUser: undefined,
      }),
      (set): EntityActions => ({
        selectUser: (user) => set({ selectedUser: user }),
      }),
    );
    ```

  - Store with custom sorter:

    ```ts
    const useStore = createEntityStore<Entity>({ sort: sorter });
    ```

  - Store with custom id selector (required if the model doesn't have an id property):

    ```ts
    interface Product {
      sku: string;
    }

    const useStore = createEntityStore<Product, string>({
      idSelector: (product) => product.sku,
    });
    ```

## **Contributing**

If you want to contribute to this project:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make the changes and commit them (`git commit -m 'Add new feature'`).
4. Push the changes to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## **Acknowledgment**

This project could not exist without the amazing work from the [`@ngrx`](https://ngrx.io/) and the [`RTK`](https://redux-toolkit.js.org/) teams.
