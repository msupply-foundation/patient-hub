import { Box, Typography } from "@material-ui/core";
import { useTranslations } from "../hooks";
import { Icon } from "./icons";
import { stylesFactory } from "../utils";

const useStyles = stylesFactory((theme) => ({
  root: {
    backgroundColor: theme.palette.menubar.main,
  },
}));

export const Footer = () => {
  const { messages } = useTranslations();
  const classes = useStyles();

  return (
    <Box
      className={classes.root}
      height="30px"
      marginTop="auto"
      flexDirection="row"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="caption">{messages.from}</Typography>
      <Box width={10} />
      <Icon.NewZealand />
      <Box width={10} />
      <Typography variant="caption">{messages.with}</Typography>
      <Box width={10} />
      <Icon.Aroha />
      <Box width={10} />
      <Typography variant="caption">{messages.andSponsorshipBy}</Typography>
      <Box width={10} />
      <Icon.MFAT />
    </Box>
  );
};
