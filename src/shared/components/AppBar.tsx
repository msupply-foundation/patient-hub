import { AppBar as MuiAppBar, IconButton, Toolbar } from "@material-ui/core";
import { FC, ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "./icons";

interface AppBarProps {
  RightComponent?: ReactElement | null;
}

export const AppBar: FC<AppBarProps> = ({ RightComponent = null }) => {
  const history = useHistory();

  return (
    <MuiAppBar position="static" color="secondary">
      <Toolbar>
        <IconButton
          aria-controls="fade-menu"
          aria-haspopup="true"
          onClick={() => history.push("/")}
        >
          <Icon.MsupplyMan />
        </IconButton>

        <div style={{ marginLeft: "auto" }} />
        {RightComponent}
      </Toolbar>
    </MuiAppBar>
  );
};
