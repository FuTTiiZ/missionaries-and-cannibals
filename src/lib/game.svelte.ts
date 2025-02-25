import { wait } from './misc'
import { type Bank, BankType, type Move, PersonType } from './types'

export let moves = $state({ value: 0 })

class GameState {
  banks: [Bank, Bank]
  currentBank: BankType = $state(BankType.START)

  constructor(banks: [Bank, Bank], currentBank: BankType) {
    this.banks = structuredClone(banks)
    this.currentBank = currentBank
  }

  get oppositeBank(): BankType {
    return (this.currentBank + 1) & 1
  }

  isMoveValid(move: Move) {
    return !(
      this.banks[this.currentBank][PersonType.MISSIONARY] <
        move[PersonType.MISSIONARY] ||
      this.banks[this.currentBank][PersonType.CANNIBAL] <
        move[PersonType.CANNIBAL] ||
      (this.banks[this.oppositeBank][PersonType.MISSIONARY] +
        move[PersonType.MISSIONARY] >
        0 &&
        this.banks[this.oppositeBank][PersonType.MISSIONARY] +
          move[PersonType.MISSIONARY] <
          this.banks[this.oppositeBank][PersonType.CANNIBAL] +
            move[PersonType.CANNIBAL]) ||
      (this.banks[this.currentBank][PersonType.MISSIONARY] -
        move[PersonType.MISSIONARY] >
        0 &&
        this.banks[this.currentBank][PersonType.MISSIONARY] -
          move[PersonType.MISSIONARY] <
          this.banks[this.currentBank][PersonType.CANNIBAL] -
            move[PersonType.CANNIBAL])
    )
  }

  doMove(move: Move) {
    //if (!this.isMoveValid(move)) throw Error('Invalid move')

    this.banks[this.currentBank][PersonType.CANNIBAL] -=
      move[PersonType.CANNIBAL]
    this.banks[this.oppositeBank][PersonType.CANNIBAL] +=
      move[PersonType.CANNIBAL]

    this.banks[this.currentBank][PersonType.MISSIONARY] -=
      move[PersonType.MISSIONARY]
    this.banks[this.oppositeBank][PersonType.MISSIONARY] +=
      move[PersonType.MISSIONARY]

    this.currentBank = this.oppositeBank
  }

  get moves(): Move[] {
    return (
      [
        [1, 0],
        [2, 0],
        [0, 1],
        [0, 2],
        [1, 1],
      ] as Move[]
    ).filter(m => this.isMoveValid(m))
  }

  isWin() {
    return (
      this.banks[BankType.END][PersonType.CANNIBAL] +
        this.banks[BankType.END][PersonType.MISSIONARY] ===
      6
    )
  }

  set(state: GameState) {
    this.banks = structuredClone(state.banks)
    this.currentBank = state.currentBank
  }

  clone() {
    return new GameState(this.banks, this.currentBank)
  }
}

const INITIAL_STATE = new GameState(
  [
    [3, 3],
    [0, 0],
  ],
  BankType.START
)

export const gameState = $state(INITIAL_STATE)

const visitedStates: GameState[] = []
const hasVisitedState = (state: GameState) =>
  visitedStates.some(
    vState =>
      vState.banks[BankType.START][PersonType.CANNIBAL] ===
        state.banks[BankType.START][PersonType.CANNIBAL] &&
      vState.banks[BankType.START][PersonType.MISSIONARY] ===
        state.banks[BankType.START][PersonType.MISSIONARY] &&
      vState.banks[BankType.END][PersonType.CANNIBAL] ===
        state.banks[BankType.END][PersonType.CANNIBAL] &&
      vState.banks[BankType.END][PersonType.MISSIONARY] ===
        state.banks[BankType.END][PersonType.MISSIONARY] &&
      vState.currentBank === state.currentBank
  )

const SOLVE_SPEED = 250 // ms

const depthFirstSearch = async (moves: Move[] = []) => {
  await wait(SOLVE_SPEED)
  if (gameState.isWin()) return moves

  for (let i = 0; i < gameState.moves.length; i++) {
    const move = gameState.moves[i]
    const nextState = gameState.clone()
    nextState.doMove(move)

    if (hasVisitedState(nextState)) continue

    visitedStates.push(nextState)
    gameState.set(nextState)
    moves.push(move)
    return depthFirstSearch(moves)
  }

  moves.pop()
  return depthFirstSearch(moves)
}
//depthFirstSearch().then(solveMoves => (moves.value = solveMoves.length))
