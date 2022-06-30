import _ from "lodash"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { GameBoard } from "../../molecules/GameBoard/GameBoard"
import { getBoardDimensions, getSquaresCount } from "../../utils/boardHelpers"

const TIMER = 1000

export const MemoryBlocks: FC<GameProps> = ({
  turn,
  level,
  onRoundComplete,
}) => {
  const [activeSqures, setActiveSqaures] = useState<number[]>([])
  const [clickedSqaures, setClickedSqaures] = useState<number[]>([])
  const [showActiveSqures, setShowActiveSqaures] = useState<boolean>(true)
  const [showClickedSquares, setShowClickedSquares] = useState<boolean>(true)
  const [score, setScore] = useState(0)

  const sqauresCount = useMemo(() => getSquaresCount(level), [level])
  const boardDimensions = useMemo(() => getBoardDimensions(level), [level])

  const checkStatus = () => {
    // const isPerfect = clickedSqaures
    //   .sort()
    //   .every((v, i) => v === activeSqures.sort()[i])
    const accuracy =
      _.intersection(clickedSqaures, activeSqures).length / activeSqures.length
    onRoundComplete(accuracy, score)
  }

  useEffect(() => {
    if (clickedSqaures.length === sqauresCount) {
      // setShowClickedSquares(false)
      setTimeout(() => setShowClickedSquares(false), 300)
      setTimeout(checkStatus, 600)
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
    setActiveSqaures(squares)
    setClickedSqaures([])
    setShowActiveSqaures(true)
    setTimeout(() => {
      setShowActiveSqaures(false)
      setShowClickedSquares(true)
    }, TIMER)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn])

  const onClickSqaure = useCallback(
    (index: number) => {
      if (
        clickedSqaures.indexOf(index) > -1 ||
        showActiveSqures ||
        clickedSqaures.length === sqauresCount
      ) {
        return
      }
      const newClickedSqaures = [...clickedSqaures, index]
      setClickedSqaures(newClickedSqaures)
      const bonus =
        activeSqures.indexOf(index) > -1
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
    />
  )
}

export interface GameProps {
  turn: number
  level: number
  onRoundComplete: (accuracy: number, score?: number) => void
  onScoreUpdate?: (score?: number) => void
}
