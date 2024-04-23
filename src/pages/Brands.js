import PageHeader from "../components/PageHeader";
import Container from '@mui/material/Container';
import ParticleBackground from '../components/ParticleBackground';
import BrandTable from '../components/tables/BrandTable';

const Brands = () => {

    return (
        <Container component="main" sx={{ marginTop:'20px' , padding:'10px', justifyContent: 'center'}}>
            <Container sx={{position: 'absolute', zIndex:-1}}>
                <ParticleBackground />
            </Container>
            <Container >
                <PageHeader text="Brands" color="#81BE83" textColor="white"/>
                <BrandTable/>
             </Container>
        </Container>
      );
};

export default Brands;