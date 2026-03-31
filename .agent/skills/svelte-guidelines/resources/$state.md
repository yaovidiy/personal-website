# Svelte 5 Rune: `$state`

The `$state` rune is Svelte 5's fundamental tool for declaring reactive state. Under the hood, `$state` creates deeply reactive proxies.

## Best Practices

1. **Use for Local Component State:**
   Use `$state` for data that changes over time and needs to trigger UI updates within your components.
   ```svelte
   <script>
     let count = $state(0);
   </script>
   <button onclick={() => count++}>{count}</button>
   ```

2. **Deep Reactivity:**
   Take advantage of `$state`'s deep reactivity. When you wrap an object or array in `$state`, mutating its properties or elements will automatically trigger updates.
   ```svelte
   <script>
     let user = $state({ name: 'Alice', age: 25 });
   </script>
   <!-- This will trigger reactivity automatically -->
   <button onclick={() => user.age++}>Increase Age</button>
   ```

3. **Pass State Down as Props (when appropriate):**
   In Svelte 5, you can seamlessly pass reactive state down to child components, and mutations within the child can be synchronized if bound (via `bind:prop`), keeping the state flow simple. Note: properties passed directly are derived and read-only by default unless explicitly synchronized.

4. **Isolate State with Context for Global Usage:**
   If you need global state across multiple components, instantiate your `$state` within a function and pass it down using Svelte's `setContext` and `getContext`.

## Anti-Patterns

- ❌ **Global Server State (Cross-Request Pollution):**
  Never declare an exported `$state` variable at the top level of a shared module (e.g., a `.svelte.ts` file) if that file will be executed on the server during Server-Side Rendering (SSR). This creates a single instance shared across all users, leading to severe data leakage. Always scope state to the component lifecycle or inject it via Context.
  ```typescript
  // BAD: Shared across all users on the server!
  export const globalCounter = $state({ count: 0 }); 
  ```

- ❌ **Using `$state` for Computed Values:**
  Don't duplicate state or manually synchronize multiple `$state` variables. If a value can be derived entirely from existing state, you must use `$derived` instead.
  ```svelte
  <script>
    let firstName = $state('John');
    let lastName = $state('Doe');
    // BAD: Don't use $state for this
    let fullName = $state('John Doe'); 
  </script>
  ```

- ❌ **Reassigning State from Props Incorrectly:**
  Creating a local `$state` variable initialized from a prop often breaks reactivity. If the parent updates the prop, the child's local `$state` will not automatically synchronize. Use `$derived` if you need to react to prop changes.
