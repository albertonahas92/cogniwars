import React, { FC, useCallback, useEffect, useReducer } from "react"
import { useSelector } from "react-redux"
import { userSelector } from "../../../store/userSlice"
import { challengeSelector } from "../../../store/challengeSlice"
import { useScores } from "../../../hooks/useScores"
import {
  GameActionType,
  gameReducer,
  initialGameState,
  startingTurn,
} from "../GameReducer"
import { Box, Typography, Divider, Paper } from "@mui/material"
import { MemoryBlocks } from "../../Games/MemoryBlocks"
import { MemoryPath } from "../../Games/MemoryPath"
import { styled } from "@mui/system"
import { QuickMath } from "../../Games/QuickMath"
import { DotsHunter } from "../../Games/DotsHunter"
import { Unique } from "../../Games/Unique"
import { Immigration } from "../../Games/Immigration"
import { Sorter } from "../../Games/Sorter"
import { gamesData } from "../../../utils/helpers"

const Contaienr = styled(Paper)(
  ({ theme }) => `
  padding: 20px;
  box-sizing: border-box;
  line-height: 0;
  display: flex;
  justify-content: center;
  padding: ${theme.spacing(3)};
  border-radius: 10px;
`
)

const games = {
  MemoryBlocks: MemoryBlocks,
  MemoryPath: MemoryPath,
  QuickMath: QuickMath,
  DotsHunter: DotsHunter,
  Unique: Unique,
  Immigration: Immigration,
  Sorter: Sorter,
  Random: "",
}

export const GamePlay: FC<Props> = ({ display, onComplete }) => {
  const challenge = useSelector(challengeSelector)
  const startingLevel = gamesData.find(
    (game) => game.key === challenge?.game
  )?.startingLevel
  const [{ turn, score, level, accuracy, answered, submitted }, dispatch] =
    useReducer(gameReducer, {
      ...initialGameState,
      level: startingLevel || initialGameState.level,
    })
  const user = useSelector(userSelector)
  const { writeScore } = useScores()

  const onScoreUpdate = useCallback(
    (score?: number) => {
      dispatch({
        type: GameActionType.SCORE,
        payload: {
          score: score || 0,
        },
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const onRoundComplete = useCallback(
    (accuracy: number, score?: number) => {
      dispatch({
        type: GameActionType.ANSWER,
        payload: {
          accuracy: Math.round(accuracy * 100) / 100,
          score: score || 0,
        },
      })
      setTimeout(() => {
        dispatch({
          type: GameActionType.NEXT,
        })
      }, 1000)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    if (challenge && answered && turn === challenge.rounds) {
      onComplete?.(turn, accuracy, score)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, turn])

  useEffect(() => {
    if (
      !challenge ||
      !challenge.id ||
      !user ||
      (!answered && turn !== startingTurn) ||
      submitted
    ) {
      return
    }
    writeScore(score, accuracy, turn)
    dispatch({
      type: GameActionType.SUBMIT,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, turn, answered, submitted, score, accuracy, challenge])

  return display ? (
    <>
      <Contaienr elevation={24}>
        {challenge?.game &&
          games[challenge?.game] &&
          React.createElement(games[challenge?.game], {
            level,
            turn,
            onRoundComplete,
            onScoreUpdate,
          })}
      </Contaienr>
      <Box sx={{ mt: 1 }}>
        <Typography color="text.secondary" sx={{ mt: 2 }} variant="body1">
          Score: <strong>{score}</strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>
      {answered && turn >= (challenge?.rounds || 10) && (
        <Box aria-label="done message" sx={{ mt: 2 }}>
          <Typography variant="h6" color="primary.light">
            Done!
          </Typography>
        </Box>
      )}
    </>
  ) : (
    <></>
  )
}
interface Props {
  display?: boolean
  onComplete?: (turn?: number, accuracy?: number, score?: number) => void
}
