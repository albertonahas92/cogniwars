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
import { Sort } from "../../icons/GamesIcons/sort"
import { Blocks } from "../../icons/GamesIcons/blocks"
import { Unique } from "../../icons/GamesIcons/unique"
import { Path } from "../../icons/GamesIcons/path"
import { Math } from "../../icons/GamesIcons/math"
import { QuestionMarkRounded, SvgIconComponent } from "@mui/icons-material"
import { Dot } from "../../icons/GamesIcons/dot"
import { Immigration } from "../../icons/GamesIcons/immigration"

export interface LevelDialogProps {
  open: boolean
  setup?: ChallengeSetup
  onClose: (setup?: ChallengeSetup) => void
}

export const GameTypes = [
  "Random",
  "MemoryBlocks",
  "QuickMath",
  "MemoryPath",
  "Sorter",
  "Unique",
  "DotsHunter",
  "Immigration",
] as const
export type GameType = typeof GameTypes[number]

type GameItem = {
  key: GameType
  name: string
  rounds: number
  timeout?: number
  Icon?: SvgIconComponent
}

export const gamesData: GameItem[] = [
  {
    key: "Random",
    name: "Random",
    Icon: QuestionMarkRounded,
    rounds: 10,
  },
  {
    key: "MemoryBlocks",
    name: "Memory Blocks",
    Icon: Blocks,
    rounds: 10,
  },
  {
    key: "QuickMath",
    name: "Quick Math",
    Icon: Math,
    rounds: 1,
  },
  {
    key: "MemoryPath",
    name: "Memory Path",
    Icon: Path,
    rounds: 10,
  },
  {
    key: "Sorter",
    name: "Sorter",
    Icon: Sort,
    rounds: 10,
  },
  {
    key: "DotsHunter",
    name: "Dots Hunter",
    Icon: Dot,
    rounds: 10,
  },
  {
    key: "Unique",
    name: "Unique",
    Icon: Unique,
    rounds: 1,
  },
  {
    key: "Immigration",
    name: "Immigration",
    Icon: Immigration,
    rounds: 1,
  },
]

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
