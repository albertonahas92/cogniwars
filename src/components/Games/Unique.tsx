import { FC, useEffect, useMemo, useRef, useState } from "react"
import { Timer } from "../../atoms/Timer/Timer"
import { getBoardDimensions, getSquareSize } from "../../utils/boardHelpers"
import { GameProps } from "./MemoryBlocks"
import {
  nudge,
  ShapeBlock,
  ShapesBoard,
  ShapesWrapper,
} from "../../molecules/GameBoard/ShapesBoard"
import { generateShapesBoard } from "../../utils/helpers"

const SHAPES_SPRITE = [4, 4] // 3,4
const SHAPES_COUNT = SHAPES_SPRITE[0] * SHAPES_SPRITE[1]

const getShape = (num: number) =>
  `calc(100% * ${num % SHAPES_SPRITE[0]}) calc(100% * ${Math.floor(
    num / SHAPES_SPRITE[1]
  )})`
const getShapesCount = (d: number) => Math.round(Math.sqrt(d))

export const Unique: FC<GameProps> = ({
  turn,
  level,
  onRoundComplete,
  onScoreUpdate,
}) => {
  const [shapes, setShapes] = useState<number[][]>([])
  const [clickedShape, setClickedShape] = useState({ index: -1, shape: -1 })
  const [showClickedShape, setShowClickedShape] = useState(true)
  const [score, setScore] = useState(0)
  const [index, setIndex] = useState(0)
  const [currentLevel, setCurrentLevel] = useState<number>(level)

  const scoreRef = useRef(0)
  const accuracyRef = useRef(0)

  const boardDimensions = useMemo(
    () => getBoardDimensions(currentLevel),
    [currentLevel]
  )
  const shapesCount = useMemo(
    () => getShapesCount(boardDimensions * boardDimensions),
    [boardDimensions]
  )

  const checkStatus = () => {
    const isCorrect = isUnique(clickedShape.shape)
    isCorrect && setCurrentLevel((l) => l + 1)
    setIndex((index) => index + 1)
    onScoreUpdate?.(score)
  }

  const finish = () => {
    onRoundComplete(accuracyRef.current / index, 0)
  }

  useEffect(() => {
    if (!clickedShape || clickedShape.shape === -1) return
    setTimeout(() => setShowClickedShape(false), 300)
    setTimeout(checkStatus, 600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedShape])

  useEffect(() => {
    const board = generateShapesBoard(
      boardDimensions,
      shapesCount,
      SHAPES_COUNT
    )
    setShapes(board)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const onClickShape = (shape: number, index: number) => {
    setClickedShape({ shape, index })
    setShowClickedShape(true)
    const correct = isUnique(shape)
    const bonus = correct ? 100 * shapesCount : -1 * 100 * shapesCount
    scoreRef.current = Math.max(scoreRef.current + bonus, 0)
    accuracyRef.current = correct
      ? accuracyRef.current + 1
      : accuracyRef.current
    setScore(scoreRef.current)
  }

  const isUnique = (shape: number) =>
    shapes.flatMap((r) => r).filter((s) => s === shape).length === 1

  const displaycurrentLevel = () => {
    let current = -1
    return shapes.map((row: number[]) => (
      <div key={current}>
        {row.map((col: number) => {
          current += 1
          const isActive =
            clickedShape && clickedShape.index === current && showClickedShape
          const isInvalid =
            clickedShape &&
            clickedShape.index === current &&
            !isUnique(col) &&
            showClickedShape
          return (
            <ShapeBlock
              key={current}
              active={isActive}
              invalid={isInvalid}
              tabIndex={current}
              focusRipple
              onMouseDown={onClickShape.bind(null, col, current)}
              sx={{
                backgroundPosition: getShape(col),
                backgroundImage:
                  col === -1 ? "none" : `url('./assets/imgs/icons2.png')`,
                animation: isInvalid ? `${nudge} .4s linear` : "",
                pointerEvents: col === -1 ? "none" : "",
                backgroundSize: `calc(100% * 5) calc(100% * 4)`,
              }}
              size={getSquareSize(boardDimensions)}
            />
          )
        })}
      </div>
    ))
  }

  return (
    <>
      {
        <Timer
          active={true}
          countdown={true}
          endtime={30}
          onTimerStop={finish}
        ></Timer>
      }
      <ShapesBoard>
        <ShapesWrapper>
          {shapes.length ? displaycurrentLevel() : <h1>{score}</h1>}
        </ShapesWrapper>
      </ShapesBoard>
    </>
  )
}
