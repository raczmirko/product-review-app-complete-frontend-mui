import PageHeader from "../components/PageHeader";
import Container from '@mui/material/Container';
import ParticleBackground from '../components/ParticleBackground';
import CountryTable from '../components/tables/CountryTable';

const Countries = () => {

    return (
        <Container container component="main" sx={{ marginTop:'20px' , padding:'10px', justifyContent: 'center'}}>
            <Container sx={{position: 'absolute', zIndex:-1}}>
                <ParticleBackground />
            </Container>
            <Container >
                <PageHeader text="Countries" color="#81BE83" textColor="white"/>
                <CountryTable/>
             </Container>
        </Container>
      );
};

export default Countries;