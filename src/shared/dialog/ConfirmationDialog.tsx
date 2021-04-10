import { FC } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { AppBar } from "../components";
import { Box, createStyles, makeStyles } from "@material-ui/core";
import { Theme } from "../containers/ThemeProvider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      color: theme.palette.success.main,
    },
  })
);

interface ConfirmationDialogProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  content?: string;
  confirmButtonText?: string;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  open,
  handleClose,
  title,
  content,
  confirmButtonText = "Ok",
}) => {
  const classes = useStyles();

  return (
    <Dialog fullWidth open={open}>
      <AppBar
        LeftComponent={
          <Typography style={{ color: "#4d4d4d" }}>{title}</Typography>
        }
      ></AppBar>
      <DialogContent>
        <Box display="flex" justifyContent="center" mb={2}>
          <ThumbUpIcon
            className={classes.icon}
            style={{ width: 100, height: 100 }}
          />
        </Box>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus variant="outlined">
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
