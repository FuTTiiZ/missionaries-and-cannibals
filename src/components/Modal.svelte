<script lang="ts">
  const {
    children = undefined,
    width = undefined,
    height = undefined,
    active,
  } = $props()
</script>

<div class="wrapper {active ? 'active' : ''}">
  <div class="modal" style:width style:height>{@render children?.()}</div>
</div>

<style>
  .wrapper {
    position: absolute;
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 0;
    pointer-events: none;

    transition: opacity 250ms ease-in-out;
  }
  .wrapper.active {
    opacity: 1;
    pointer-events: all;
  }

  .modal {
    width: clamp(400px, 80%, 1000px);
    height: clamp(400px, 50%, 1000px);

    background: #ffffff8d;
    border-radius: 1rem;
    backdrop-filter: blur(15px) saturate(0.3);
    filter: drop-shadow(0 0 10px #000);

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;
    padding: 1rem;

    translate: 0 1rem;
    transition: translate 250ms ease-in-out;
  }

  .wrapper.active .modal {
    translate: 0 0;
  }
</style>
