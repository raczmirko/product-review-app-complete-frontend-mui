import PageHeader from "../components/PageHeader";
import Container from '@mui/material/Container';
import ParticleBackground from '../components/ParticleBackground';
import PackagingTable from "../components/tables/PackagingTable";

const Packagings = () => {

    return (
        <Container component="main" sx={{ marginTop:'20px' , padding:'10px', justifyContent: 'center'}}>
            <Container sx={{position: 'absolute', zIndex:-1}}>
                <ParticleBackground />
            </Container>
            <Container >
                <PageHeader text="Packagings" color="#81BE83" textColor="white"/>
                <PackagingTable defPageSize={10} />
             </Container>
        </Container>
      );
};

export default Packagings;