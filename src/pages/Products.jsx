import Container from "@mui/material/Container";
import PageHeader from "../components/PageHeader";
import ParticleBackground from "../components/ParticleBackground";
import ProductTable from "../components/tables/ProductTable";

const Articles = () => {
  return (
    <Container
      component="main"
      sx={{ marginTop: "20px", padding: "10px", justifyContent: "center" }}
    >
      <Container sx={{ position: "absolute", zIndex: -1 }}>
        <ParticleBackground />
      </Container>
      <Container>
        <PageHeader text="Products" color="#81BE83" textColor="white" />
        <ProductTable />
      </Container>
    </Container>
  );
};

export default Articles;
