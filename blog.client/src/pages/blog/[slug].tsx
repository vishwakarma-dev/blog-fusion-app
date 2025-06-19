import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Stack,
  Chip,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import api from '@Blog/lib/axios';
import AppHeader from '@Blog/components/AppHeader';
import { useSnackbar } from '@Blog/hooks/useSnackbar';

export default function PostDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageURL, setImageURL] = useState('');

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user?._id || null);
  }, []);

  useEffect(() => {
    if (slug) {
      api
        .get(`/posts/slug/${slug}`)
        .then((res) => {
          const postData = res.data;
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);
          setTags(postData.tags.join(', '));
          setImageURL(postData.image_URL || '');
        })
        .catch(() => {
          showSnackbar('Post not found or unauthorized', 'error');
          router.push('/blog');
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleUpdate = async () => {
    try {
      await api.put(`/posts/${post._id}`, {
        title,
        content,
        tags: tags.split(',').map((t) => t.trim()),
        image_URL: imageURL,
      });
      showSnackbar('Post updated successfully!', 'success');
      setIsEditing(false);
      router.reload(); // Refresh the page with updated post
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      showSnackbar('Post deleted successfully!', 'success');
      router.push('/blog');
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  if (loading || !post) {
    return (
      <>
        <AppHeader />
        <Container sx={{ mt: 10, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  const isOwner = true;

  return (
    <>
      <AppHeader />
      <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
        
        {isOwner && (
          <Box display="flex" justifyContent="flex-end" m={4}>
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{ mr: 2 }}
            >
              ✏️ Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              🗑️ Delete
            </Button>
          </Box>
        )}

        <Card variant="outlined">
          {imageURL && !isEditing && (
            <CardMedia component="img" height="250" image={imageURL} alt={title} />
          )}
          <CardContent>
            {isEditing ? (
              <>
                <Box padding={4}>
                  <Typography variant="h4" gutterBottom fontWeight={600}>
                    ✏️ Edit Blog Post
                  </Typography>

                  <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <TextField
                    label="Content"
                    fullWidth
                    multiline
                    rows={6}
                    margin="normal"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <TextField
                    label="Tags (comma-separated)"
                    fullWidth
                    margin="normal"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <TextField
                    label="Image URL"
                    fullWidth
                    margin="normal"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                  />

                  <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button
                      variant="contained"
                      onClick={handleUpdate}
                      sx={{ px: 4, py: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {content}
                </Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  {post.tags.map((tag: string, idx: number) => (
                    <Chip key={idx} label={`#${tag}`} variant="outlined" />
                  ))}
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      </Container>

      {SnackbarComponent}
    </>
  );
}
