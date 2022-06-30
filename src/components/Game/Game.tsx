import { FC, useMemo, useState } from "react"

import _ from "lodash"
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import { Challenge, Player } from "../../types/challenge"
import { User } from "../../types/user"
import { PlayerChip } from "../../molecules/PlayerChip/PlayerChip"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { GamePlay } from "./GamePlay/GamePlay"
import { RematchButton } from "../../atoms/RematchButton/RematchButton"
import ChallengeInfo from "../../molecules/ChallengeInfo/ChallengeInfo"
import { ChallengeDoneDialog } from "../../molecules/ChallengeDoneDialog/ChallengeDoneDialog"
import ChallengeOnboarding from "../../molecules/ChallengeOnboarding/ChallengeOnboarding"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"

export type GameStatus =
  | "loading"
  | "error"
  | "waiting"
  | "waiting_others"
  | "started"
  | "finished"

export const Game: FC<Props> = ({
  user,
  challenge,
  players,
  gameStatus,
  onClickLeave,
  onClickRematch,
  onClickPlayAgain,
  onComplete,
  rematch,
  error,
}) => {
  const [openOnBoarding, setOpenOnBoarding] = useState(true)

  const maxScore = useMemo(() => {
    if (!players || players.length < 2) return user?.displayName
    return _.maxBy(players, "timedScore")?.displayName
  }, [players, user?.displayName])

  const renderPlayers = () => (
    <Stack
      direction="row"
      sx={{ justifyContent: "center", flexWrap: "wrap", gap: 2 }}
    >
      {players?.map((p, i) => (
        <PlayerChip player={p} key={i} isWinning={maxScore === p.displayName} />
      ))}
    </Stack>
  )

  const isAcceptRematch = challenge?.rematchRequested && !rematch

  return (
    <Container>
      <Typography
        component="h1"
        variant="h2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Cogniwars
      </Typography>

      {gameStatus !== "loading" ? (
        <>
          {gameStatus !== "finished" && <ChallengeInfo challenge={challenge} />}
          {gameStatus &&
            ["started", "waiting_others", "finished"].includes(gameStatus) &&
            players && <Box sx={{ mt: 2 }}>{renderPlayers()}</Box>}
          {!challenge?.rematchRequested &&
            !openOnBoarding &&
            gameStatus !== "finished" && (
              <Box sx={{ my: 2 }}>
                <GamePlay
                  display={gameStatus !== "waiting"}
                  onComplete={onComplete}
                />
              </Box>
            )}
          {gameStatus === "waiting" && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h2"
                aria-label="waiting for players"
                color="primary.light"
                sx={{ fontWeight: 400, fontSize: "1.5rem" }}
              >
                Waiting for players to join
              </Typography>
              <CircularProgress sx={{ my: 4 }} />
            </Box>
          )}
          {gameStatus === "waiting_others" && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                aria-label="waiting for players to finish"
                color="primary.light"
              >
                Waiting for players to finish...
              </Typography>
            </Box>
          )}
          {gameStatus === "error" && (
            <Alert sx={{ my: 4 }} severity="error">
              {error}
            </Alert>
          )}
          {gameStatus === "finished" && (
            <Typography
              component="p"
              variant="h4"
              color="secondary"
              sx={{ m: 3 }}
            >
              Game Over!
            </Typography>
          )}
          {challenge?.rematchRequested && (
            <>
              <Typography
                component="p"
                variant="h6"
                color="primary.light"
                sx={{ m: 3 }}
              >
                Rematch request pending
              </Typography>
              <CircularProgress sx={{ mb: 4 }} />
            </>
          )}
        </>
      ) : (
        <Box sx={{ my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      <Stack
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
        direction="row"
      >
        {gameStatus === "finished" && players && (
          <RematchButton
            onClick={onClickRematch}
            disabled={rematch || players?.length === 1}
            pulsing={isAcceptRematch}
          />
        )}
        {!openOnBoarding && (
          <Button
            variant="outlined"
            color="error"
            aria-label="leave"
            onClick={onClickLeave}
            endIcon={<ExitToAppIcon />}
            sx={{ mt: 1 }}
          >
            {challenge?.id ? "Leave" : "Exit"}
          </Button>
        )}
      </Stack>
      <ChallengeDoneDialog
        open={gameStatus === "finished" && !rematch}
        onClose={onClickLeave}
        onClickRematch={onClickRematch}
        onClickPlayAgain={onClickPlayAgain}
        players={players}
      />
      {challenge && (
        <ModalDialog
          open={openOnBoarding}
          onClose={() => setOpenOnBoarding(false)}
          maxWidth="xs"
        >
          <ChallengeOnboarding
            challenge={challenge}
            onReady={() => setOpenOnBoarding(false)}
          />
        </ModalDialog>
      )}
    </Container>
  )
}

interface Props {
  user?: User | null
  challenge?: Challenge
  players?: Player[]
  gameStatus?: GameStatus
  onClickLeave: () => void
  onClickRematch: () => void
  onClickPlayAgain: () => void
  onComplete: () => void
  rematch: boolean
  error?: string
}
