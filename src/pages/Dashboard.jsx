import Container from "@mui/material/Container";
import PageHeader from "../components/PageHeader";
import ParticleBackground from "../components/ParticleBackground";
import ChartsAndStatistics from "../components/dashboard-component/ChartsAndStatistics";

const Dashboard = () => {
  return (
    <Container
      component="main"
      sx={{ marginTop: "20px", padding: "10px", justifyContent: "center" }}
    >
      <Container sx={{ position: "absolute", zIndex: -1 }}>
        <ParticleBackground />
      </Container>
      <Container>
        <PageHeader text="Dashboard" color="#81BE83" textColor="white" />
        <ChartsAndStatistics />
      </Container>
    </Container>
  );
};

export default Dashboard;
