import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, CircularProgress } from '@mui/material';
import api from '@Blog/lib/axios';

interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profile_picture?: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/users/${id}`)
        .then(res => setUser(res.data))
        .catch(() => alert('User not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!user) return;
    try {
      await api.put(`/users/${user._id}`, {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile_picture: user.profile_picture,
      });
      alert('User updated');
      setEditMode(false);
    } catch {
      alert('Update failed');
    }
  };

  if (loading || !user) return <CircularProgress />;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4">{editMode ? 'Edit User' : 'User Profile'}</Typography>

      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={user.username}
        disabled={!editMode}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={user.email}
        disabled={!editMode}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <TextField
        label="Bio"
        fullWidth
        margin="normal"
        value={user.bio || ''}
        disabled={!editMode}
        onChange={(e) => setUser({ ...user, bio: e.target.value })}
      />
      <TextField
        label="Profile Picture URL"
        fullWidth
        margin="normal"
        value={user.profile_picture || ''}
        disabled={!editMode}
        onChange={(e) => setUser({ ...user, profile_picture: e.target.value })}
      />

      {editMode ? (
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpdate}>Save</Button>
      ) : (
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setEditMode(true)}>Edit</Button>
      )}
    </Container>
  );
}
