import { Box } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { useIsSmallScreen } from "../hooks";

type FieldProps = {
  description?: string;
  id?: string;
  variant?: "caption" | "subtitle2";
};

export const DescriptionField = (props: FieldProps) => {
  const isSmallScreen = useIsSmallScreen();

  const { description = "", variant = "subtitle2" } = props;
  if (!description) return null;

  const lines = description.split("\n");
  if (lines.length === 1)
    return <Typography variant="subtitle2">{description}</Typography>;

  return (
    <Box
      bgcolor="rgb(236, 243, 252)"
      p={isSmallScreen ? 1 : 2}
      m={isSmallScreen ? 1 : 2}
      style={{ borderRadius: 5 }}
    >
      {props.description
        ?.split("\n")
        .map((description: string, index: number) => (
          <Typography
            display="block"
            variant={variant}
            style={{
              marginBottom: 7,
              whiteSpace: "normal",
            }}
            key={index}
          >
            {description}
          </Typography>
        ))}
    </Box>
  );
};
