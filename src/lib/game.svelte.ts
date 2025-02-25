import { wait } from './misc'
import { type Bank, BankType, type Move, PersonType } from './types'

class GameState {
  banks: [Bank, Bank]
  currentBank: BankType = $state(BankType.START)

  constructor(banks: [Bank, Bank], currentBank: BankType) {
    this.banks = banks
    this.currentBank = currentBank
  }

  get oppositeBank(): BankType {
    return (this.currentBank + 1) & 1
  }

  isMoveValid(move: Move) {
    return !(
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
    if (!this.isMoveValid(move)) throw Error('Invalid move')

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

  set(state: GameState) {
    this.banks = state.banks
    this.currentBank = state.currentBank
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
