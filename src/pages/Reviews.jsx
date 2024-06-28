import Container from '@mui/material/Container';
import PageHeader from "../components/PageHeader";
import ParticleBackground from '../components/ParticleBackground';
import ReviewTable from '../components/tables/ReviewTable';

const Reviews = () => {

    return (
        <Container component="main" sx={{ marginTop:'20px' , padding:'10px', justifyContent: 'center'}}>
            <Container sx={{position: 'absolute', zIndex:-1}}>
                <ParticleBackground />
            </Container>
            <Container>
                <PageHeader text="Reviews" color="#81BE83" textColor="white"/>
                <ReviewTable />
             </Container>
        </Container>
      );
};

export default Reviews;