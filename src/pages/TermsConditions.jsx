import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";

export const TermsAndConditions = () => (
  <Grid
    container
    sx={{
      minHeight: "100vh",
      backgroundImage: "url(https://picsum.photos/1920/1080)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {/* Centered Content Column */}
    <Grid
      item
      xs={12}
      sm={8}
      md={6}
      sx={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        justifyContent: "left",
        textAlign: "left",
        px: 2,
        py: 8,
      }}
    >
      <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography variant="body1" paragraph>
          By using this website, you agree to the following terms:
        </Typography>

        <Typography variant="h6">1. Purpose of the Website</Typography>
        <Typography variant="body1" paragraph>
          This project was created for my own personal use and is published as a portfolio
          project to showcase my software engineering skills. The website serves as a platform
          for selected users to rate and review products.
        </Typography>

        <Typography variant="h6">2. User Registration and Access</Typography>
        <Typography variant="body1" paragraph>
          While users can register on the platform, all registrations require manual activation
          by the administrator. Only selected individuals will be granted access to the system.
        </Typography>

        <Typography variant="h6">3. User-Generated Content</Typography>
        <Typography variant="body1" paragraph>
          Users are responsible for the content they post, including reviews and ratings. The
          website does not verify, endorse, or guarantee the accuracy of any user-generated content.
        </Typography>

        <Typography variant="h6">4. Prohibited Activities</Typography>
        <Typography variant="body1" paragraph>
          Users may not post defamatory, false, misleading, or offensive content. The
          administrator reserves the right to remove any content that violates these terms.
        </Typography>

        <Typography variant="h6">5. Data Collection and Privacy</Typography>
        <Typography variant="body1" paragraph>
          The website collects minimal user data: username, country (provided by the user and can be anything), and a securely
          hashed password. This information is used solely for authentication and platform functionality.
        </Typography>

        <Typography variant="h6">6. Limitation of Liability</Typography>
        <Typography variant="body1" paragraph>
          The website is provided "as is" without any warranties. The owner is not responsible for any
          damages resulting from the use of this platform.
        </Typography>

        <Typography variant="h6">7. Changes to Terms</Typography>
        <Typography variant="body1" paragraph>
          These terms may be updated at any time. Users are responsible for reviewing changes.
        </Typography>

        <Typography variant="h6">Last updated: 2025, February 23rd</Typography>
        </Box>
      </Container>
    </Grid>
  </Grid>
);

export default TermsAndConditions;
