import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { GameBoard } from "../../molecules/GameBoard/GameBoard"
import { getSquaresCount, getBoardDimensions } from "../../utils/boardHelpers"
import { GameProps } from "./MemoryBlocks"

const STARTING_TIMER = 900

export const DotsHunter: FC<GameProps> = ({ turn, level, onRoundComplete }) => {
  const [activeSqure, setActiveSqaure] = useState(-1)
  const [clickedSqaure, setClickedSqaure] = useState(-1)
  const [showActiveSquare, setShowActiveSqaure] = useState(true)
  const [showClickedSquare, setShowClickedSquare] = useState(true)
  const [score, setScore] = useState(0)

  const flashes = useRef(0)

  const sqauresCount = useMemo(() => getSquaresCount(level), [level])
  const boardDimensions = useMemo(() => getBoardDimensions(level), [level])

  const finishTurn = () => {
    flashes.current = 0
    setShowClickedSquare(false)
    setClickedSqaure(-1)
    setTimeout(checkStatus, 300)
  }
  const checkStatus = () => {
    const isCorrect = clickedSqaure === activeSqure
    onRoundComplete(Number(isCorrect), score)
  }

  useEffect(() => {
    if (clickedSqaure === -1) return
    setTimeout(() => setShowClickedSquare(false), 300)
    setTimeout(finishTurn, 600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedSqaure])

  useEffect(() => {
    const flashesInterval = setInterval(() => {
      if (flashes.current >= sqauresCount) {
        setShowActiveSqaure(false)
        setShowClickedSquare(true)
        clearInterval(flashesInterval)
        return
      }
      const r = Math.floor(Math.random() * (boardDimensions * boardDimensions))

      setActiveSqaure(r)
      flashes.current += 1
    }, STARTING_TIMER / level)

    setShowActiveSqaure(true)

    return () => {
      clearInterval(flashesInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn])

  const onClickSqaure = (index: number) => {
    if (showActiveSquare) {
      return
    }
    setClickedSqaure(index)
    const bonus = activeSqure === index ? level * level * 10 : 0
    setScore((prevScore) => prevScore + bonus)
  }

  return (
    <GameBoard
      boardDimensions={boardDimensions}
      activeSqures={[activeSqure]}
      clickedSqaures={[clickedSqaure]}
      onClickSqaure={onClickSqaure}
      showActiveSqures={showActiveSquare}
      showClickedSquares={showClickedSquare}
    />
  )
}
