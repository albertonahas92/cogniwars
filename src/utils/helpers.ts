/* eslint-disable no-mixed-operators */
import { MedalType } from "../icons/Medal/Medal"

// const wikipediaURL =
//   "https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles="

const avatarURL = "https://avatars.dicebear.com/api/identicon/"

export const getAvatarURL = () => {
  const seed = Math.round(Math.random() * 99999)
  return `${avatarURL}${seed}.svg`
}

export const getLevelLabel = (level: number) => {
  switch (level) {
    case 1:
      return "Easy"
    case 2:
      return "Medium"
    case 3:
      return "Hard"
    case 4:
      return "Expert"
    default:
      return "Impossible"
  }
}

export const gameEvals: {
  medal: MedalType
  message: string
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning"
}[] = [
  { medal: "grey", message: "way to go", color: "error" },
  { medal: "blue", message: "You still have a lot to learn", color: "warning" },
  { medal: "silver", message: "You have a good knowledge!", color: "primary" },
  { medal: "purple", message: "You are a polyglot!!", color: "primary" },
  { medal: "gold", message: "You are unstoppable!!!", color: "success" },
]

export const getEval = (accuracy: number) => {
  switch (true) {
    case accuracy < 0.2:
      return gameEvals[0]
    case accuracy < 0.4:
      return gameEvals[1]
    case accuracy < 0.6:
      return gameEvals[2]
    case accuracy < 0.8:
      return gameEvals[3]
    default:
      return gameEvals[4]
  }
}

export const getLv = (xp?: number) => {
  const factor = 150
  let n = factor,
    lv = 1

  while (n <= (xp || 0)) {
    n += Math.round(factor * Math.pow(lv, 1.5))
    lv++
  }

  return {
    lv,
    next: n,
    progress: Math.round(((xp || 0) * 100) / (n || 1)),
  }
}

// mulberry32
export const getRandomFromSeed = (a: number) => {
  var t = (a += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const genNum = (shapesCount: number) => Math.floor(Math.random() * shapesCount)

export const generateShapesBoard = (
  boardDimensions: number,
  itemsCount: number,
  shapesCount: number
) => {
  const squares = []

  for (let index = 0; index < itemsCount; index += 1) {
    const lastShape = genNum(shapesCount)
    for (let s = 0; s < index + 1; s += 1) {
      squares.push(lastShape)
    }
  }
  const boardArr = []
  for (let i = 0; i < boardDimensions * boardDimensions; i += 1) {
    if (i < squares.length) {
      boardArr[i] = squares[i]
    } else {
      boardArr[i] = -1
    }
  }
  boardArr.sort(() => 0.5 - Math.random())

  const boardArr2D: number[][] = []
  for (let i = 0; i < boardDimensions; i += 1) {
    boardArr2D[i] = new Array(boardDimensions)
    for (let j = 0; j < boardDimensions; j += 1) {
      const index = boardDimensions * i + j
      boardArr2D[i][j] = boardArr[index]
    }
  }
  return boardArr2D
}

export const getBrowserLocales = (options = {}) => {
  const defaultOptions = {
    languageCodeOnly: false,
  }
  const opt = {
    ...defaultOptions,
    ...options,
  }
  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages
  if (!browserLocales) {
    return undefined
  }
  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim()
    return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
  })
}
