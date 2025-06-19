import { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useRouter } from 'next/router';
import api from '@Blog/lib/axios';

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.get('/users')
      .then((res) => setUsers(res.data))
      .catch(() => alert('Failed to load users'));
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>All Users</Typography>
      <List>
        {users.map(user => (
          <ListItem
            key={user._id}
            secondaryAction={
              <Button onClick={() => router.push(`/users/${user._id}`)}>View</Button>
            }
          >
            <ListItemText primary={user.username} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
