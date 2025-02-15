import { Typography } from "@mui/material";
import Link from "@mui/material/Link";

const CopyrightTypography = () => {
  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 3 }}
      >
        {`Copyright © Product Review Application by Mirkó Rácz in ${new Date().getFullYear()}. `}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ m: 1 }}
      >
        {"Made with "}
        <Link color="inherit" href="https://mui.com/">
          MUI.
        </Link>
      </Typography>
    </>
  );
};

export default CopyrightTypography;
