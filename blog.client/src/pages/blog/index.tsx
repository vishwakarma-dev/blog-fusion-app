import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Grid,
  Box,
  Chip,
  Stack,
  Divider,
  Fab,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import api from '@Blog/lib/axios';
import AppHeader from '@Blog/components/AppHeader';
import ScrollTop from '@Blog/components/ScrollToTop';

interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  author_id: any;
  image_URL: string;
}

export default function BlogFeed() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [bookmarks, setBookmarks] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  // Load all posts
  useEffect(() => {
    api.get('/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Load user likes and bookmarks
  useEffect(() => {
    const fetchUserEngagement = async () => {
      try {
        const [likesRes, bookmarksRes] = await Promise.all([
          api.get('/likes/user'), // backend must return array of post_id
          api.get('/bookmarks'),
        ]);

        const likedMap = Object.fromEntries(
          likesRes.data.map((like: any) => [like.post_id, true]) // Fix this line
        );

        const bookmarkMap = Object.fromEntries(
          bookmarksRes.data.map((bm: any) => [bm.post_id._id || bm.post_id, true])
        );


        setLikes(likedMap);
        setBookmarks(bookmarkMap);
      } catch (error) {
        console.error('Failed to load likes/bookmarks', error);
      }
    };

    fetchUserEngagement();
  }, []);


  // Like toggle
  const handleLike = async (postId: string) => {
    const alreadyLiked = likes[postId];

    try {
      if (alreadyLiked) {
        await api.delete(`/likes/${postId}`);
        setLikes((prev) => ({ ...prev, [postId]: false }));
      } else {
        await api.post(`/likes/${postId}`);
        setLikes((prev) => ({ ...prev, [postId]: true }));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  // Bookmark toggle
  const handleBookmark = async (postId: string) => {
    const alreadyBookmarked = bookmarks[postId];

    try {
      if (alreadyBookmarked) {
        await api.delete(`/bookmarks/${postId}`);
        setBookmarks((prev) => ({ ...prev, [postId]: false }));
      } else {
        await api.post(`/bookmarks/${postId}`);
        setBookmarks((prev) => ({ ...prev, [postId]: true }));
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };


  return (
    <>
      <AppHeader />
      <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
        <Box
          id="back-to-top-anchor"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" fontWeight={700}>
            📝 Blog Feed
          </Typography>
          <Button
            variant="contained"
            size="medium"
            onClick={() => router.push('/blog/create')}
            sx={{ fontWeight: 600, px: 3 }}
          >
            ➕ Create Blog
          </Button>
        </Box>

        <Grid container spacing={3}>
          {posts.length === 0 ? (
            <Typography variant="body1" textAlign="center" width="100%">
              No blog posts available. Start by creating one!
            </Typography>
          ) : (
            posts.map((post) => (
              <Grid size={12} key={post._id}>
                <Card
                  variant="outlined"
                  sx={{
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  {post.image_URL && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.image_URL}
                      alt={post.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}

                  <CardContent>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {post.content.length > 200
                        ? `${post.content.slice(0, 200)}...`
                        : post.content}
                    </Typography>

                    <Stack direction="row" spacing={1} mb={2}>
                      {post.tags.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={`#${tag}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="caption" color="text.secondary">
                        {post.author_id?.full_name || 'Unknown Author'}
                      </Typography>

                      <CardActions sx={{ p: 0, gap: 1 }}>
                        <Tooltip title="Like">
                          <IconButton onClick={() => handleLike(post._id)}>
                            {likes[post._id] ? (
                              <FavoriteIcon color="error" />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Bookmark">
                          <IconButton onClick={() => handleBookmark(post._id)}>
                            {bookmarks[post._id] ? (
                              <BookmarkIcon color="primary" />
                            ) : (
                              <BookmarkBorderIcon />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Button
                          size="small"
                          variant="text"
                          onClick={() => router.push(`/blog/${post.slug}`)}
                        >
                          Read More →
                        </Button>
                      </CardActions>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <ScrollTop>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </Container>
    </>
  );
}
