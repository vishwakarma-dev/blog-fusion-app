import { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Stack,
  Box,
  Divider,
  InputAdornment,
} from '@mui/material';
import { useRouter } from 'next/router';
import api from '@Blog/lib/axios';
import AppHeader from '@Blog/components/AppHeader';
import ImageIcon from '@mui/icons-material/Image';

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    if (!tags.trim()) newErrors.tags = 'At least one tag is required';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post('/posts', {
        title,
        content,
        tags: tags.split(',').map((tag) => tag.trim()),
        image_URL: imageURL,
      });
      router.push('/blog');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating post');
    }
  };

  return (
    <>
      <AppHeader />
      <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          ✍️ Create New Blog Post
        </Typography>

        <Stack spacing={3} mt={3}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
          />

          <TextField
            label="Content"
            multiline
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={!!errors.content}
            helperText={errors.content}
            fullWidth
          />

          <TextField
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            error={!!errors.tags}
            helperText={errors.tags || 'Example: tech, javascript, design'}
            fullWidth
          />

          <TextField
            label="Image URL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="https://example.com/image.png"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          {imageURL && (
            <Box mt={1} textAlign="center">
              <img
                src={imageURL}
                alt="Preview"
                style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }}
              />
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Button
          variant="contained"
          onClick={handleSubmit}
          size="large"
          sx={{ px: 5, py: 1.5 }}
        >
          🚀 Publish Blog
        </Button>
      </Container>
    </>
  );
}
