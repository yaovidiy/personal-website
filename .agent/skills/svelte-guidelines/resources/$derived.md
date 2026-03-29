# Svelte 5 Rune: `$derived`

The `$derived` rune is used to declare state that is computed entirely from other reactive state (like `$state` or other `$derived` values). It replaces Svelte 4's reactive statements (`$:`) for assignments.

## Best Practices

1. **Use for Computations:**
   Whenever a value can be calculated from other existing state, use `$derived`. It guarantees that your state stays synchronized and prevents bugs related to outdated data.
   ```svelte
   <script>
     let numbers = $state([1, 2, 3]);
     let total = $derived(numbers.reduce((sum, n) => sum + n, 0));
   </script>
   ```

2. **Efficient Recalculation:**
   `$derived` values are evaluated lazily and only recalculate when their underlying dependencies change. Use them freely; they are optimized for performance.

3. **Use `$derived.by` for Complex Logic:**
   If your derivation logic requires multiple steps, early returns, or a try/catch block, use `$derived.by` and pass a closure.
   ```svelte
   <script>
     let user = $state({ first: 'John', last: 'Doe', isAnon: false });
     let displayName = $derived.by(() => {
       if (user.isAnon) return 'Anonymous';
       return `${user.first} ${user.last}`.trim();
     });
   </script>
   ```

## Anti-Patterns

- ❌ **Performing Side Effects:**
  `$derived` is exclusively for computing values. Never place side effects (like updating the DOM directly, logging to the console, or making network requests) inside a `$derived` declaration. Use `$effect` for those scenarios.
  ```svelte
  <script>
    let count = $state(0);
    // BAD: Side effect in derived!
    let double = $derived(count * 2); $derived(console.log("Count changed:", count));
  </script>
  ```

- ❌ **Mutating State within a Derivation:**
  Never modify a `$state` variable inside a `$derived` expression. Derivations must be pure functions—they take state as input and return a computed value.
  ```svelte
  <script>
    let a = $state(1);
    let b = $state(2);
    // BAD: Mutating 'b' inside derived calculation for 'sum'
    let sum = $derived.by(() => {
        b = a * 2; 
        return a + b;
    });
  </script>
  ```

- ❌ **Over-Complicating Derivations:**
  Avoid creating highly complex, deeply nested `$derived` chains that are hard to reason about. If computing the value becomes too heavy, consider memoizing explicitly or shifting the computation off the main thread if it severely impacts performance.
