import {
  AppBar as MuiAppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { FC, ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "./icons";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Theme } from "../../shared/containers/ThemeProvider";
interface AppBarProps {
  RightComponent?: ReactElement | null;
  LeftComponent?: ReactElement;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.menubar.main,
    },
  })
);

const Msupply: FC = () => (
  <Box>
    <Box flexDirection="row" display="flex">
      <Typography color="primary">m</Typography>
      <Typography>Supply</Typography>
    </Box>
    <Typography variant="caption">Patient Hub</Typography>
  </Box>
);

export const AppBar: FC<AppBarProps> = ({
  RightComponent = null,
  LeftComponent = <Msupply />,
}) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <MuiAppBar
      position="static"
      style={{ backgroundColor: "#ecf3fc" }}
      className={classes.root}
    >
      <Toolbar>
        <IconButton
          aria-controls="fade-menu"
          aria-haspopup="true"
          onClick={() => history.push("/")}
        >
          <Icon.MsupplyMan />
          <Box m={1} />
          {LeftComponent}
        </IconButton>

        <div style={{ marginLeft: "auto" }} />
        {RightComponent}
      </Toolbar>
    </MuiAppBar>
  );
};
