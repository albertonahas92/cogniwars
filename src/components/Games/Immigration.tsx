import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { GameProps } from "./MemoryBlocks"
import { Arrow, DIR_LEFT, DIR_RIGHT } from "../../atoms/Arrow/Arrow"
import { Timer } from "../../atoms/Timer/Timer"
import { getBoardDimensions, getSquareSize } from "../../utils/boardHelpers"
import {
  nudge,
  ShapeBlock,
  ShapesBoard,
  ShapesWrapper,
} from "../../molecules/GameBoard/ShapesBoard"
import { generateShapesBoard } from "../../utils/helpers"

const STARTING_CURRENTLEVEL = 1
const DIRECTIONS_COUNT = 2

const getShapesCount = (d: number) => Math.round(Math.sqrt(d))

export const Immigration: FC<GameProps> = ({
  turn,
  level,
  onRoundComplete,
  onScoreUpdate,
}) => {
  const [currentLevel, setCurrentLevel] = useState(level)
  const [index, setIndex] = useState(0)
  const [shapes, setShapes] = useState<number[][]>([])
  const [clickedShape, setClickedShape] = useState({ index: -1, shape: -1 })
  const [showClickedShape, setShowClickedShape] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const scoreRef = useRef(0)
  const shapesRef = useRef<number[][]>([])

  const boardDimensions = useMemo(
    () => getBoardDimensions(currentLevel),
    [currentLevel]
  )
  const shapesCount = useMemo(
    () => getShapesCount(boardDimensions * boardDimensions),
    [boardDimensions]
  )

  const finishTurn = () => {
    checkStatus()
    setIndex((t) => t + 1)
  }

  const checkStatus = () => {
    if (isImmigration(clickedShape.shape)) {
      setCurrentLevel((preVal) => preVal + 1)
    } else {
      setCurrentLevel((preVal) => Math.max(preVal - 1, STARTING_CURRENTLEVEL))
    }
    onScoreUpdate?.(score)
  }

  const finish = () => {
    setFinished(true)
    onRoundComplete(false, scoreRef.current)
  }

  useEffect(() => {
    if (!clickedShape || clickedShape.shape === -1) return
    setTimeout(() => setShowClickedShape(false), 300)
    setTimeout(finishTurn, 600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedShape])

  useEffect(() => {
    const board = generateShapesBoard(
      boardDimensions,
      shapesCount,
      DIRECTIONS_COUNT
    )
    shapesRef.current = board
    setShapes(board)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const onClickShape = (shape: number, index: number) => {
    setClickedShape({ shape, index })
    setShowClickedShape(true)
    const bonus = isImmigration(shape)
      ? 100 * shapesCount
      : -1 * 100 * shapesCount
    scoreRef.current = Math.max(scoreRef.current + bonus, 0)
    setScore(scoreRef.current)
  }

  const isImmigration = (shape: number) =>
    shapesRef.current.flatMap((r) => r).filter((s) => s === shape).length >
    shapesRef.current.flatMap((r) => r).filter((s) => s === +!shape).length

  const displayCurrentLevel = () => {
    let current = -1
    return shapes.map((row) => (
      <div key={current}>
        {row.map((col) => {
          current += 1
          const isActive =
            clickedShape &&
            (clickedShape.index === current ||
              (clickedShape.shape === col && clickedShape.index === -1)) &&
            showClickedShape
          const isInvalid = isActive && !isImmigration(col)
          return (
            <ShapeBlock
              key={current}
              active={isActive}
              invalid={isInvalid}
              tabIndex={current}
              focusRipple
              onMouseDown={onClickShape.bind(null, col, current)}
              sx={{
                backgroundImage:
                  col === -1 ? "none" : `url('./assets/imgs/immigration.png')`,
                transform: `scaleX(${(-1) ** col})`,
                pointerEvents: col === -1 ? "none" : "",
                animation: isInvalid ? `${nudge} .4s linear` : "",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
              size={getSquareSize(boardDimensions)}
            />
          )
        })}
      </div>
    ))
  }

  const onRightArrowClick = () => {
    onClickShape(+DIR_LEFT, -1)
  }

  const onLeftArrowClick = () => {
    onClickShape(+DIR_RIGHT, -1)
  }

  const onKeyDown = (e: any) => {
    const key = e.which
    if (key === 39) {
      // the enter key code or right arrow
      onLeftArrowClick()
    } else if (key === 37) {
      // left arrow
      onRightArrowClick()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ShapesBoard>
        <Arrow direction={DIR_LEFT} onClick={onRightArrowClick} />
        <Arrow direction={DIR_RIGHT} onClick={onLeftArrowClick} />
        <ShapesWrapper>
          {!finished && (
            <Timer
              active={true}
              countdown={true}
              endtime={10}
              onTimerStop={finish}
            ></Timer>
          )}
          {displayCurrentLevel()}
        </ShapesWrapper>
      </ShapesBoard>
    </>
  )
}
