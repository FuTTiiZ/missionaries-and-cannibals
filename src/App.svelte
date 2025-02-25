<script lang="ts">
  import BankComponent from './components/Bank.svelte'
  import Person from './components/Person.svelte'
  import Modal from './components/Modal.svelte'
  import { type Bank, PersonType, BankType, type Move } from './lib/types'
  import { gameState as gs } from './lib/game.svelte'

  const banks: [Bank, Bank] = $derived(
    gs.banks.map((bank, i: BankType) =>
      gs.currentBank === i
        ? bank.map((count, j: PersonType) => count - boat[j])
        : bank
    ) as [Bank, Bank]
  )

  let boat: Move = $state([0, 0])
  const boatSum = $derived(boat.reduce((a, b) => a + b))

  const isMoveValid = $derived(gs.isMoveValid(boat))

  let moves = $state(0)
  const success = $derived(
    banks[BankType.END][PersonType.CANNIBAL] +
      banks[BankType.END][PersonType.MISSIONARY] ===
      6
  )

  const addToBoat = (type: PersonType) => {
    if (boatSum > 1) return
    boat[type]++
  }
  const removeFromBoat = (type: PersonType) => {
    boat[type]--
  }
  const moveBoat = () => {
    gs.doMove(boat)
    boat = [0, 0]
    moves++
  }

  let hintActive = $state(false)
</script>

<main>
  <BankComponent
    active={!success && gs.currentBank === BankType.END}
    bank={banks[BankType.END]}
    clickHandler={addToBoat}
  />
  <div class="river">
    <div
      class="boat"
      style="align-self: {gs.currentBank === BankType.START
        ? 'flex-end'
        : 'flex-start'}"
    >
      {#each { length: boat[PersonType.CANNIBAL] }, _}
        <Person
          type={PersonType.CANNIBAL}
          clickHandler={() => removeFromBoat(PersonType.CANNIBAL)}
        />
      {/each}
      {#each { length: boat[PersonType.MISSIONARY] }, _}
        <Person
          type={PersonType.MISSIONARY}
          clickHandler={() => removeFromBoat(PersonType.MISSIONARY)}
        />
      {/each}
      {#if boatSum > 0 && isMoveValid}
        <button
          class="arrow {gs.currentBank === BankType.END ? 'reverse' : ''}"
          onclick={moveBoat}><span>Move</span></button
        >
      {/if}
    </div>
    <div class="water"></div>
  </div>
  <BankComponent
    active={!success && gs.currentBank === BankType.START}
    bank={banks[BankType.START]}
    clickHandler={addToBoat}
  />
</main>

<Modal width="450px" height="fit-content" active={success}>
  <h1>🎉 CONGRATULATIONS! 🎉</h1>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
    "
  >
    <p style:font-size="1.5rem">You won in {moves} moves</p>
    <button
      style="
        padding: 0.25rem 0.5rem;
        background: linear-gradient(#9f9, #9f0);
        font-size: 2rem;
        border: none;
        border-radius: 0.25rem;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 2px 10px #00000069;
        cursor: pointer;
      "
      onclick={() => window.location.reload()}
    >
      RETRY
    </button>
  </div>
</Modal>

<Modal width="470px" height="fit-content" active={hintActive}>
  <h1>Missionaries & Cannibals</h1>
  <h2 style:margin="0">What is the goal?</h2>
  <p style:margin="0">
    The goal is to move all missionaries and cannibals to the other side of the
    river.
  </p>
  <br />
  <h2 style:margin="0">How to play?</h2>
  <p style:margin="0">
    Select missionaries and cannibals on the river bank the boat is at.<br />
    If a move is valid, a green arrow labelled "MOVE" will appear. Click it to move
    the boat.<br /><br />
    The boat can only contain a maximum of <strong>2</strong> people at a time.<br
    /><br />
    At no point can the missionaries on one side of the river be outnumbered by cannibals.
    The challenge of the game is moving everyone to one side without the missionaries
    being "eaten".
  </p>
  <br />
  <h2 style:margin="0">Hints</h2>
  <ol style="position: relative; margin-left: -3rem; max-width: 400px">
    <li>The best move might not be the most obvious</li>
    <li>You can never get stuck... You always have the ability to backtrack</li>
  </ol>
  <p>Good luck :)</p>
</Modal>

<button class="hint" onclick={() => (hintActive = !hintActive)}> ? </button>

<style>
  .hint {
    position: absolute;
    width: 3rem;
    height: 3rem;
    font-size: 2rem;
    left: 1rem;
    bottom: 32vh;
    border: none;
    background: #ffffff69;
    border: 2px solid #000;
    border-radius: 50%;
    cursor: pointer;
  }

  main {
    position: absolute;
    width: 100vw;
    height: 100vh;
    perspective: 200px;
  }

  .river {
    height: 30%;
    transform: rotateZ(10deg);

    display: flex;
    justify-content: center;
  }

  .water {
    position: absolute;
    width: 100%;
    height: 100%;
    scale: 2 1;
    background-image: linear-gradient(
      to right,
      rgb(59, 159, 221),
      rgb(18, 133, 204)
    );
    box-shadow: 0 0 15px #45997d;
    filter: blur(10px);
  }

  .boat {
    position: relative;
    align-self: flex-end;
    width: 250px;
    height: 125px;
    background-color: rgb(59, 45, 25);
    background-image: linear-gradient(transparent, rgb(41, 31, 17));
    background-size: 100% 20%;
    border: 4px solid rgb(41, 31, 17);
    border-radius: 25% 45% 45% 25%;
    box-shadow:
      0 0 10px #000 inset,
      0 0 10px 5px #081a3dba;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 35px;
    z-index: 1;
  }

  @keyframes bop {
    100% {
      translate: 0 0.5rem;
    }
  }

  .arrow {
    position: absolute;
    top: -100px;

    width: 35px;
    height: 70px;
    background: #0f0;
    display: flex;
    justify-content: center;

    border: none;

    cursor: pointer;

    animation: bop 1000ms ease-in-out infinite alternate-reverse;
  }
  .arrow::after {
    position: absolute;
    --size: 35px;
    top: calc(-1 * var(--size) + 2px);
    display: block;
    content: '';
    width: 0;
    height: 0;

    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
    border-bottom: var(--size) solid #0f0;
  }
  .arrow span {
    text-transform: uppercase;
    font-weight: bold;
    color: green;
    font-size: 1.2rem;
    writing-mode: vertical-rl;
    scale: -1;
  }
  .arrow.reverse {
    rotate: 180deg;
    top: 140px;
  }
  .arrow.reverse span {
    scale: 1;
  }
</style>
