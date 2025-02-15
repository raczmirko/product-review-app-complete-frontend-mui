import Container from "@mui/material/Container";
import PageHeader from "../components/PageHeader";
import ParticleBackground from "../components/ParticleBackground";
import CharacteristicTable from "../components/tables/CharacteristicTable";

const Characteristics = () => {
  return (
    <Container
      component="main"
      sx={{ marginTop: "20px", padding: "10px", justifyContent: "center" }}
    >
      <Container sx={{ position: "absolute", zIndex: -1 }}>
        <ParticleBackground />
      </Container>
      <Container>
        <PageHeader text="Characteristics" color="#81BE83" textColor="white" />
        <CharacteristicTable />
      </Container>
    </Container>
  );
};

export default Characteristics;
