import { styled } from "@mui/system"
import React, { FC, useEffect, useRef, useState } from "react"
import { Arrow, DIR_LEFT, DIR_RIGHT } from "../../atoms/Arrow/Arrow"
import { Timer } from "../../atoms/Timer/Timer"
import { ShapesBoard } from "../../molecules/GameBoard/ShapesBoard"
import { GameProps } from "./MemoryBlocks"
import { keyframes } from "@emotion/react"
import { Box } from "@mui/material"

// const TIMER = 60
const SHAPES_SPRITE = [2, 2] // 3,4
const SHAPES_COUNT = SHAPES_SPRITE[0] * SHAPES_SPRITE[1]

const DIR_NONE = undefined

const fadeInLeft = keyframes` 
    0% {
       opacity: 1;
       transform: translateX(0);
    }
    100% {
       opacity: 0;
       transform: translateX(60vw);
    }
 `
const fadeInRight = keyframes` 
    0% {
       opacity: 1;
       transform: translateX(0);
    }
    100% {
       opacity: 0;
       transform: translateX(-60vw);
    }
 `

export const Shape = styled(Box)`
  background-image: url("./assets/imgs/sorter.png");
  background-size: calc(100% * 3);
  width: 60px;
  height: 60px;
  margin: 0 auto;
  position: relative;
  animation-fill-mode: backwards;
  animation-timing-function: ease-in;
`

export const Sorter: FC<GameProps> = ({
  turn,
  level,
  onRoundComplete,
  onScoreUpdate,
}) => {
  const scoreRef = useRef(0)
  const accuracyRef = useRef(0)

  const [multiplier, setMultiplier] = useState(1)
  const [index, setIndex] = useState(turn)
  const [finished, setFinished] = useState(false)

  const [shape, setShape] = useState(0)
  const [prevShape, setPrevShape] = useState(-1)

  const directionRef = useRef<boolean | undefined>(DIR_NONE)
  const [direction, setDirection] = useState<boolean | undefined>(DIR_NONE)
  const [prevDirection, setPrevDirection] = useState<boolean | undefined>(
    DIR_NONE
  )

  const genNum = () => Math.floor(Math.random() * SHAPES_COUNT)
  const genDir = () => Math.random() > 0.5
  const getShape = (num: number) =>
    `calc(100% * ${num % SHAPES_SPRITE[0]}) calc(100% * ${Math.floor(
      num / SHAPES_SPRITE[1]
    )})`

  const slideShape = (dir?: boolean) => {
    if (finished) return
    setPrevDirection(directionRef.current)
    directionRef.current = dir
    setDirection(dir)
    setTimeout(() => {
      setDirection(DIR_NONE)
      setIndex((turn) => turn + 1)
    }, 200)
  }

  const onLeftArrowClick = () => {
    slideShape(DIR_LEFT)
  }

  const onRightArrowClick = () => {
    slideShape(DIR_RIGHT)
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
    setShape(genNum())
    setTimeout(() => {
      setDirection(genDir())
    }, 500)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setShape(genNum())
    // debugger;
    if (prevShape !== -1 && prevDirection !== DIR_NONE) {
      const correct =
        (prevShape === shape && prevDirection === directionRef.current) ||
        (prevShape !== shape && prevDirection !== directionRef.current)
      const bonus = correct ? 100 * multiplier : -200
      setMultiplier((mult) => (correct ? Math.min(mult, 6) + 1 : 1))
      accuracyRef.current = correct
        ? accuracyRef.current + 1
        : accuracyRef.current
      scoreRef.current = Math.max(scoreRef.current + bonus, 0)
      onScoreUpdate?.(scoreRef.current)
    }
    setPrevShape(shape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const finish = () => {
    setFinished(true)
    window.removeEventListener("keydown", onKeyDown)
    onRoundComplete(accuracyRef.current / index, scoreRef.current)
  }

  return (
    <Box>
      {!finished && (
        <Timer
          active={true}
          countdown={true}
          endtime={30}
          onTimerStop={finish}
        ></Timer>
      )}
      <ShapesBoard sx={{ my: 8 }}>
        <Arrow direction={DIR_LEFT} onClick={onRightArrowClick} />
        <Arrow direction={DIR_RIGHT} onClick={onLeftArrowClick} />
        <Shape
          sx={{
            backgroundPosition: getShape(shape),
            animation: `${
              direction === DIR_RIGHT
                ? fadeInRight
                : direction === DIR_LEFT
                ? fadeInLeft
                : ""
            } 300ms`,
          }}
        />
      </ShapesBoard>
    </Box>
  )
}
