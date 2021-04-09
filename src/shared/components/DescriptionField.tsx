import { Box, useMediaQuery } from "@material-ui/core";
import { Typography } from "@material-ui/core";

type FieldProps = {
  description?: string;
  id?: string;
  variant?: "caption" | "subtitle2";
};

export const DescriptionField = (props: FieldProps) => {
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );

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
    >
      {props.description
        ?.split("\n")
        .map((description: string, index: number) => (
          <Typography
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
