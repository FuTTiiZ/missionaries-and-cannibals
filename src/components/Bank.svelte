<script lang="ts">
  import { PersonType } from '../lib/types'
  import Person from './Person.svelte'

  const {
    active,
    bank,
    clickHandler,
  }: {
    active: boolean
    bank: [number, number]
    clickHandler: (type: PersonType) => void
  } = $props()
</script>

<div class="bank" style="pointer-events: {active ? 'all' : 'none'}">
  <div class="people">
    {#each { length: bank[PersonType.CANNIBAL] }, _}
      <Person
        type={PersonType.CANNIBAL}
        clickHandler={() => clickHandler(PersonType.CANNIBAL)}
      />
    {/each}
    {#each { length: bank[PersonType.MISSIONARY] }, _}
      <Person
        type={PersonType.MISSIONARY}
        clickHandler={() => clickHandler(PersonType.MISSIONARY)}
      />
    {/each}
  </div>
</div>

<style>
  .bank {
    height: 35%;
    display: flex;
    justify-content: center;
  }

  .bank:first-child {
    align-items: flex-end;
    padding-bottom: 2rem;
    padding-left: 3rem;
  }

  .bank:last-child {
    align-items: flex-start;
    padding-top: 2rem;
    padding-right: 3rem;
  }

  .people {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 1rem;
  }
</style>
