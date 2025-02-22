<script lang="ts">
  import type { PersonType } from '../lib/types'

  const { type, clickHandler }: { type: PersonType; clickHandler: () => void } =
    $props()
</script>

<button class="type{type}" onclick={clickHandler} aria-label="type{type}">
</button>

<style>
  button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    box-shadow: 0 0 10px #00000069;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
  }

  button::before {
    display: block;
    font-weight: bold;
    font-size: 2.5rem;
  }

  .type0 {
    border: 2px solid #fff;
    color: #fff;
    background-color: #000;
  }
  .type0::before {
    content: 'C';
  }

  .type1 {
    border: 2px solid #000;
    color: #000;
    background-color: #fff;
  }
  .type1::before {
    content: 'M';
  }
</style>
