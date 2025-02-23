import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WebIcon from "@mui/icons-material/Web";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import React from "react";

export default function About() {
  return (
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
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>
            About the project
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Inspired by my habit of reviewing products to better understand my
            spendings and what I like, this app was basedo on my BSc diploma
            work of designing a product-review database system.
          </Typography>

          <Card sx={{ my: 4, textAlign: "left" }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Functionality
              </Typography>
              <Typography paragraph>
                The system in question allows for product evaluations based on
                various criteria, such as taste, packaging, and color. A product
                can be a food item, a consumer good, an electronic device, and
                so on.
              </Typography>

              <Typography paragraph>
                The system keeps records of conceptual products, meaning items
                that can be purchased as concrete products in different
                packaging formats in stores. Each item has a brand and a product
                family. Items can be categorized, and categories can be
                structured hierarchically (with main categories and
                subcategories) up to a depth of three levels. For example, the
                main category could be beverages, with subcategories such as tea
                or coffee.
              </Typography>

              <Typography paragraph>
                Each category has specific attributes (e.g., color, taste), and
                products belonging to that category can have these attributes.
                Additionally, each category can be evaluated based on certain
                criteria (e.g., the beverage category can be rated based on
                taste). Products within a category are assessed based on the
                criteria associated with that category, as well as inherited
                criteria from higher-level categories, using a rating scale from
                1 to 5. The system can also store product images.
              </Typography>

              <Typography paragraph>
                Each rating is submitted by an individual and applies to a
                specific product. All data modifications are logged in the
                system.
              </Typography>

              <Typography paragraph>
                The system includes multiple user roles, such as an
                administrator with unrestricted permissions and regular users
                who are only allowed to submit evaluations.
              </Typography>
            </CardContent>
          </Card>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Technical Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <strong>Frontend:</strong> React, Material-UI, MUI-X
                <br />
                <strong>Backend:</strong> Spring Boot, Java
                <br />
                <strong>Database:</strong> PostgreSQL, Flyway for migrations
                <br />
                <strong>Infrastructure:</strong> Docker, VPS Hosting on Linux,
                Nginx, GitHub workflows
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Container sx={{ my: 4 }}>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                paddingTop: "56.25%", // 16:9 Aspect Ratio
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=esrLKRxTpY03gMw3"
                title="YouTube video player"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              ></iframe>
            </Box>
          </Container>

          <Box sx={{ my: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Connect with me:
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                component="a"
                href="https://www.linkedin.com/in/raczmirko/"
                target="_blank"
                startIcon={<LinkedInIcon />}
                variant="outlined"
              >
                LinkedIn
              </Button>
              <Button
                component="a"
                href="https://github.com/raczmirko"
                target="_blank"
                startIcon={<GitHubIcon />}
                variant="outlined"
              >
                GitHub
              </Button>
              <Button
                component="a"
                href="https://raczmirko.github.io"
                target="_blank"
                startIcon={<AccountBoxIcon />}
                variant="outlined"
              >
                Portfolio
              </Button>
              <Button
                component="a"
                href="https://okrim.hu"
                target="_blank"
                startIcon={<WebIcon />}
                variant="outlined"
              >
                Website
              </Button>
            </Stack>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}
