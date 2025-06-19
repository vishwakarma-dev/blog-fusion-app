import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';
import api from '@Blog/lib/axios';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    api.get('/bookmarks')
      .then(res => setBookmarks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4">Bookmarked Posts</Typography>
      {bookmarks.map((b, i) => (
        <Card key={i} sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="h6">{b.post_id.title}</Typography>
            <Typography>{b.post_id.content.slice(0, 100)}...</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
