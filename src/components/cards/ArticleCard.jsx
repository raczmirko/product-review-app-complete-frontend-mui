import { Card, CardContent, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const ArticleCard = ({ article }) => {

    function truncateDescription(text) {
        if (text && text.length > 25) {
            return text.substring(0, 25) + '...';
        }
        return text;
    }

    const renderArticleCard = (article) => {
        if (!article) return <CircularProgress/>;
    
        return (
            <Card sx={{ minWidth: 275, backgroundColor: '#81BE83', padding: 2, overflow: 'auto' }}>
                <CardContent>
                    <Typography variant="h5" color="black" gutterBottom>{article.name}</Typography>
                    <Typography variant="body2" color="black">ID: {article.id}</Typography>
                    <Typography variant="body2" color="black">Brand: {article.brand.name}</Typography>
                    <Typography variant="body2" color="black">Category: {article.category.name}</Typography>
                    <Typography variant="body2" color="black">Description: {truncateDescription(article.description)}</Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        renderArticleCard(article)
    );

}

export default ArticleCard;