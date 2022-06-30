/* eslint-disable no-unused-expressions */
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { Timer } from "../../atoms/Timer/Timer"
import { Numpad } from "../../atoms/Numpad/Numpad"
import { GameProps } from "./MemoryBlocks"
import { Box } from "@mui/material"

const STARTING_DIGITS = 1
const BASIC_SCORE = 200

export const QuickMath: FC<GameProps> = ({
  turn,
  level,
  onRoundComplete,
  onScoreUpdate,
}) => {
  const guessRef = useRef<string>("")
  const [guess, setGuess] = useState("")
  const equationResRef = useRef(0)
  const [equation, setEquation] = useState({
    left: 0,
    plus: true,
    right: 0,
    res: 0,
  })
  const [index, setIndex] = useState(0)
  const [currentLevel, setCurrentLevel] = useState<number>(level)
  const indexRef = useRef(0)
  const accuracyRef = useRef(0)

  const getLevelDigits = (lv: number) =>
    STARTING_DIGITS + Math.floor(Math.sqrt(lv) - 1)
  const digits = useMemo(() => getLevelDigits(currentLevel), [currentLevel])
  const max = useMemo(() => 10 * currentLevel, [currentLevel])

  const generateNum = () => Math.round(Math.random() * max)

  useEffect(() => {
    const left = generateNum()
    const right = generateNum()
    const plus = Math.random() > 0.5
    const res = plus ? left + right : left - right
    setEquation({ left, plus, right, res })
    equationResRef.current = res
    indexRef.current = index
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const onOkClickEnter = () => {
    if (!guessRef.current) return
    const roundScore = getRoundScore()
    onScoreUpdate?.(roundScore)
    roundScore > 0 && setCurrentLevel((l) => l + 1)
    accuracyRef.current =
      roundScore > 0 ? accuracyRef.current + 1 : accuracyRef.current
    setTimeout(onAnswer, 200)
  }

  const onAnswer = () => {
    setGuess("")
    guessRef.current = ""
    setIndex((index) => index + 1)
  }

  const finish = () => {
    onRoundComplete(accuracyRef.current / indexRef.current, 0)
  }

  const setGuessVal = (val: (number: string) => string) => {
    typeof val === "function" && (guessRef.current = val(guessRef.current))
    setGuess(guessRef.current)
  }

  const getRoundScore = () =>
    // eslint-disable-next-line eqeqeq
    parseInt(guessRef.current, 10) == equationResRef.current
      ? BASIC_SCORE * digits
      : 0

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Timer
        active={true}
        countdown={true}
        endtime={45}
        onTimerStop={finish}
      ></Timer>
      <div>
        <div className="wrapper">
          <p style={{ fontSize: "3em", color: "#666" }}>
            {equation.left} {equation.plus ? "+" : "-"} {equation.right} ={" "}
            {guess || ""}
          </p>
          <Numpad onOkClickEnter={onOkClickEnter} setNumber={setGuessVal} />
        </div>
      </div>
    </Box>
  )
}
