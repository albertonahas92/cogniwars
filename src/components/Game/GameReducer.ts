export const startingTurn = 1
const startingLevel = 1
const bonus = 100

export enum GameActionType {
  ANSWER = "ANSWER",
  SCORE = "SCORE",
  SUBMIT = "SUBMIT",
  NEXT = "NEXT",
}
interface GameState {
  turn: number
  accuracy: number
  level: number
  score: number
  time: number
  answered: boolean
  submitted: boolean
  correct: boolean
}

export const initialGameState: GameState = {
  turn: startingTurn,
  level: startingLevel,
  answered: false,
  submitted: false,
  correct: false,
  accuracy: 0,
  score: 0,
  time: 0,
}

type GameAction =
  | {
      type: GameActionType.ANSWER
      payload: {
        accuracy: number
        score: number
        time?: number
      }
    }
  | {
      type: GameActionType.SCORE
      payload: { score: number }
    }
  | { type: GameActionType.SUBMIT }
  | { type: GameActionType.NEXT }

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case GameActionType.ANSWER:
      return {
        ...state,
        answered: true,
        submitted: false,
        correct: action.payload.accuracy === 1,
        accuracy:
          (state.accuracy * state.turn + action.payload.accuracy) /
          (state.turn + 1),
        score:
          state.score +
          Math.max(action.payload.score, 0) +
          (action.payload.accuracy === 1 ? bonus : 0),
        level:
          state.level + (action.payload.accuracy === 1 ? 1 : -1) ||
          startingLevel,
        time: action.payload.time || state.time,
      }
    case GameActionType.SCORE:
      return {
        ...state,
        score: state.score + Math.max(action.payload.score, 0),
      }
    case GameActionType.NEXT:
      return { ...state, turn: state.turn + 1, answered: false, correct: false }
    case GameActionType.SUBMIT:
      return { ...state, submitted: true }
    default:
      return state
  }
}
