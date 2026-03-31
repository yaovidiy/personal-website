# Svelte 5 Rune: `$effect`

The `$effect` rune is used for managing side effects—synchronizing your Svelte component's state with external systems like the DOM, web APIs (like `localStorage`), canvas contexts, or third-party libraries. It replaces Svelte 4's reactive statements (`$:`) when used for side effects, as well as `onMount`, `beforeUpdate`, and `afterUpdate` in many cases.

## Best Practices

1. **Use for External Synchronization:**
   Use `$effect` when you need to write to the DOM (when declarative bindings aren't enough), log data, mount third-party UI libraries (like charts or maps), or subscribe to external events.
   ```svelte
   <script>
     let title = $state('Svelte App');
     
     // Update the document title when the state changes
     $effect(() => {
       document.title = title;
     });
   </script>
   ```

2. **Cleanup Effects:**
   If your effect sets up a subscription, an interval, or an event listener, you must return a teardown function from the `$effect`. This function will run right before the effect re-runs (if dependencies change) and when the component is destroyed.
   ```svelte
   <script>
     let isTracking = $state(true);

     $effect(() => {
       if (!isTracking) return;

       const handleMouse = (e) => console.log(e.clientX, e.clientY);
       window.addEventListener('mousemove', handleMouse);

       // Teardown function
       return () => {
         window.removeEventListener('mousemove', handleMouse);
       };
     });
   </script>
   ```

3. **Browser Only:**
   Code inside `$effect` only runs in the browser. It will not run during Server-Side Rendering (SSR). This makes it safe for referencing browser APIs like `window` or `document`.

## Anti-Patterns

- ❌ **Updating State Inside an Effect (State Synchronization):**
  This is the most common anti-pattern. Never use `$effect` to synchronize one piece of state with another. Doing so causes an extra, unnecessary re-render cycle, breaks the data flow, and can easily cause infinite loops. Always use `$derived` or compute the value directly in the event handler that caused the original state change.
  ```svelte
  <script>
    let value = $state(0);
    let doubled = $state(0);
    
    // BAD: Synchronizing state with an effect
    $effect(() => {
        doubled = value * 2;
    });
    
    // GOOD: Use $derived
    let correctlyDoubled = $derived(value * 2);
  </script>
  ```

- ❌ **Using `$effect` Instead of Event Handlers:**
  If a state change is triggered by a specific user interaction, handle the subsequent logic in the event handler (e.g., `onclick`), not by making the application "watch" for the state change in an `$effect`.
  ```svelte
  <script>
    let submittedData = $state(null);

    // BAD: Watching state to fire network request
    $effect(() => {
        if (submittedData) {
            submitToServer(submittedData);
        }
    });

    // GOOD: Handle in the event
    function handleSubmit(data) {
        submittedData = data;
        submitToServer(data);
    }
  </script>
  ```

- ❌ **Overusing `$effect`:**
  If you find yourself using `$effect` all over your code, take a step back. Svelte's declarative bindings (`bind:value`, `use:action`, transition directives) or event handlers are almost always the preferred approach. `$effect` should be an escape hatch for cases the framework doesn't intrinsically handle.
