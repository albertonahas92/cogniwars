import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import {
  Container,
  Button,
  Typography,
  TextField,
  ButtonGroup,
  Popover,
  styled,
  ButtonBase,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Box } from "@mui/system"
import { ChallengeSetup } from "../../types/challenge"
import React, { useMemo } from "react"
import { GameItem, gamesData } from "../../utils/helpers"

export interface LevelDialogProps {
  open: boolean
  setup?: ChallengeSetup
  onClose: (setup?: ChallengeSetup) => void
}

const GamesContainer = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const GameButton = styled(ButtonBase)(
  ({ theme }) => `
  flex-direction: column;
  gap: ${theme.spacing(1)};
  text-align: center;
  padding: ${theme.spacing(1)};
  width: 95px;
  border-radius: 6px;
  overflow: hidden;
`
)
const GameTitle = styled(Typography)`
  display: block;
  margin: auto;
  font-size: 1rem;
`

export const defaultChallengeSetup: ChallengeSetup = {
  level: 1,
  players: 1,
  rounds: 10,
  live: false,
  variation: "standard",
  game: "MemoryBlocks",
}

export function ChallengeSetupDialog(props: LevelDialogProps) {
  const { onClose, setup, open } = props

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleHelpClose = () => {
    setAnchorEl(null)
  }

  const helpOpen = Boolean(anchorEl)
  const id = helpOpen ? "help-popover" : undefined

  const formik = useFormik({
    initialValues: {
      ...defaultChallengeSetup,
      ...setup,
    },
    validationSchema: Yup.object({}),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      onClose({ ...values })
    },
  })

  const onClickGame = (game: GameItem) => {
    formik.setFieldValue("game", game.key)
    formik.setFieldValue("rounds", game.rounds)
  }

  const liveHelpMessage = useMemo(
    () =>
      formik.values.live
        ? "You will be challenging random players live"
        : "You will have a private challenge link to share",
    [formik]
  )

  const handleClose = () => {
    onClose()
  }

  const renderGames = () =>
    gamesData.map(({ Icon, ...game }) => (
      <GameButton onClick={() => onClickGame(game)} key={game.key}>
        {Icon && (
          <Icon
            color={formik.values.game === game.key ? "primary" : "disabled"}
            fontSize="large"
          />
        )}
        <GameTitle
          color={formik.values.game === game.key ? "primary" : "text.primary"}
        >
          {game.name}
        </GameTitle>
      </GameButton>
    ))

  return (
    <Dialog
      onClose={handleClose}
      aria-label={"Challenge Setup"}
      open={open}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>New Game</DialogTitle>
      <Container maxWidth="xs">
        <Typography variant="h3" sx={{ fontSize: "1rem", lineHeight: 1 }}>
          Choose your game
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          {setup?.players !== 1 && (
            <>
              <Box sx={{ my: 1 }}>
                <ButtonGroup aria-label="outlined button group">
                  <Button
                    aria-label="live"
                    variant={formik.values.live ? "contained" : "outlined"}
                    onClick={() => formik.setFieldValue("live", true)}
                  >
                    Live
                  </Button>
                  <Button
                    aria-label="private"
                    variant={!formik.values.live ? "contained" : "outlined"}
                    onClick={() => formik.setFieldValue("live", false)}
                  >
                    Private
                  </Button>
                </ButtonGroup>
              </Box>
              <Typography color="primary" variant="caption">
                {liveHelpMessage}
              </Typography>
              <TextField
                error={Boolean(formik.touched.players && formik.errors.players)}
                helperText={formik.touched.players && formik.errors.players}
                fullWidth
                label="Players"
                margin="normal"
                name="players"
                aria-label="players"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.players}
                variant="outlined"
                type="number"
              />
            </>
          )}
          <GamesContainer sx={{ mt: 2 }}>{renderGames()}</GamesContainer>

          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              aria-label="submit setup"
              variant="outlined"
            >
              Create
            </Button>
          </Box>
          <Popover
            id={id}
            open={helpOpen}
            anchorEl={anchorEl}
            onClose={handleHelpClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            aria-label="help popover"
          ></Popover>
        </form>
      </Container>
    </Dialog>
  )
}
