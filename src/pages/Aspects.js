import Container from '@mui/material/Container';
import PageHeader from "../components/PageHeader";
import ParticleBackground from '../components/ParticleBackground';
import AspectTable from "../components/tables/AspectTable";

const Aspects = () => {

    return (
        <Container component="main" sx={{ marginTop:'20px' , padding:'10px', justifyContent: 'center'}}>
            <Container sx={{position: 'absolute', zIndex:-1}}>
                <ParticleBackground />
            </Container>
            <Container >
                <PageHeader text="Aspects" color="#81BE83" textColor="white"/>
                <AspectTable/>
             </Container>
        </Container>
      );
};

export default Aspects;