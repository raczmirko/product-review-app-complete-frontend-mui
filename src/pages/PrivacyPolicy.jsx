import { Container, Grid, Typography } from "@mui/material";
import React from "react";

export const PrivacyPolicy = () => (
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
      <Container my={4}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          This Privacy Policy explains how we collect, use, and protect your
          information.
        </Typography>
        <Typography variant="h6">1. Data We Collect</Typography>
        <Typography variant="body1" paragraph>
          - Username (can be anything, no real names required) 
          <br/>
          - Country (given by the user, could be anything) 
          <br/>
          - Securely encryped password
        </Typography>
        <Typography variant="h6">2. Data Usage</Typography>
        <Typography variant="body1" paragraph>
          We do not sell or share your data with third parties. Your information
          is used solely for account authentication and service functionality.
        </Typography>
        <Typography variant="h6">3. Your Rights</Typography>
        <Typography variant="body1" paragraph>
          You may request data deletion at any time. Contact us at{" "}
          <strong>contact(at)okrim.hu</strong>.
        </Typography>
      </Container>
    </Grid>
  </Grid>
);

export default PrivacyPolicy;
