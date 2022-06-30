import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { GameBoard } from "../../molecules/GameBoard/GameBoard"
import { getBoardDimensions, getSquaresCount } from "../../utils/boardHelpers"
import { GameProps } from "./MemoryBlocks"

const TIMER = 3000

export const MemoryPath: FC<GameProps> = ({ turn, level, onRoundComplete }) => {
  const [fullPathSquares, setFullPathSquares] = useState<number[]>([])
  const [activeSqures, setActiveSqaures] = useState<number[]>([])
  const [clickedSqaures, setClickedSqaures] = useState<number[]>([])
  const [showActiveSqures, setShowActiveSqaures] = useState(true)
  const [showClickedSquares, setShowClickedSquares] = useState(true)
  const [score, setScore] = useState(0)

  const flashes = useRef(0)

  const sqauresCount = useMemo(() => getSquaresCount(level), [level])
  const boardDimensions = useMemo(() => getBoardDimensions(level), [level])

  const finishTurn = () => {
    checkStatus()
    flashes.current = 0
    setActiveSqaures([])
  }

  const checkStatus = () => {
    const isPerfect = clickedSqaures
      .sort()
      .every((v, i) => v === activeSqures.sort()[i])
    onRoundComplete(Number(isPerfect), score)
  }

  useEffect(() => {
    if (clickedSqaures.length === sqauresCount) {
      setTimeout(() => setShowClickedSquares(false), 300)
      setTimeout(finishTurn, 600)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedSqaures])

  useEffect(() => {
    const squares = []
    while (squares.length < sqauresCount) {
      const r = Math.floor(Math.random() * (boardDimensions * boardDimensions))
      if (squares.indexOf(r) === -1) {
        squares.push(r)
      }
    }
    setFullPathSquares(squares)
    setClickedSqaures([])
    setShowActiveSqaures(true)
    setTimeout(() => {
      setShowActiveSqaures(false)
      setShowClickedSquares(true)
    }, TIMER)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn])

  useEffect(() => {
    const flashesInterval = setInterval(() => {
      if (flashes.current >= sqauresCount) {
        clearInterval(flashesInterval)
        return
      }
      const flash = flashes.current
      setActiveSqaures((as) => {
        return [...as, fullPathSquares[flash]]
      })
      flashes.current++
    }, TIMER / (sqauresCount + 1))
    return () => {
      clearInterval(flashesInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullPathSquares])

  const onClickSqaure = useCallback(
    (index: number) => {
      if (
        clickedSqaures.indexOf(index) > -1 ||
        showActiveSqures ||
        clickedSqaures.length === sqauresCount
      ) {
        return
      }
      const clickedSquareIndex = clickedSqaures.length
      const newClickedSqaures = [...clickedSqaures, index]
      setClickedSqaures(newClickedSqaures)
      const bonus =
        activeSqures[clickedSquareIndex] === index
          ? 100 * sqauresCount
          : -1 * 100 * sqauresCount
      setScore((prevScore) => prevScore + bonus)
    },
    [activeSqures, clickedSqaures, showActiveSqures, sqauresCount]
  )

  return (
    <GameBoard
      boardDimensions={boardDimensions}
      activeSqures={activeSqures}
      clickedSqaures={clickedSqaures}
      onClickSqaure={onClickSqaure}
      showActiveSqures={showActiveSqures}
      showClickedSquares={showClickedSquares}
      ordered={true}
    />
  )
}
