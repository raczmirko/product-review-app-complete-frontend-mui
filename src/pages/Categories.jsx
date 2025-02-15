import Container from "@mui/material/Container";
import PageHeader from "../components/PageHeader";
import ParticleBackground from "../components/ParticleBackground";
import CategoryTable from "../components/tables/CategoryTable";

const Categories = () => {
  return (
    <Container
      component="main"
      sx={{ marginTop: "20px", padding: "10px", justifyContent: "center" }}
    >
      <Container sx={{ position: "absolute", zIndex: -1 }}>
        <ParticleBackground />
      </Container>
      <Container>
        <PageHeader text="Categories" color="#81BE83" textColor="white" />
        <CategoryTable />
      </Container>
    </Container>
  );
};

export default Categories;
