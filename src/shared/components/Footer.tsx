import { Box, Typography } from "@material-ui/core";
import { useTranslations } from "../hooks";
import { Icon } from "./icons";

export const Footer = () => {
  const { messages } = useTranslations();

  return (
    <Box
      bgcolor="secondary.main"
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
