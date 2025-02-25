import Container from "@mui/material/Container";
import PageHeader from "../components/PageHeader";
import ParticleBackground from "../components/ParticleBackground";
import UserTable from "../components/tables/UserTable";

const Users = () => {
  return (
    <Container
      component="main"
      sx={{ marginTop: "20px", padding: "10px", justifyContent: "center" }}
    >
      <Container sx={{ position: "absolute", zIndex: -1 }}>
        <ParticleBackground />
      </Container>
      <Container>
        <PageHeader text="Users" color="#81BE83" textColor="white" />
        <UserTable />
      </Container>
    </Container>
  );
};

export default Users;
