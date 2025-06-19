import { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Link,
  Stack,
  Divider
} from '@mui/material';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import api from '@Blog/lib/axios';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useSnackbar } from '@Blog/hooks/useSnackbar'; // ✅ your custom hook

const SignUpPage: React.FC = () => {
  const [form, setForm] = useState({
    full_name :'',
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  const router = useRouter();
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {...form, full_name : `${form.first_name} ${form.last_name}`  }
      await api.post('/auth/register', payload);
      showSnackbar('Registration successful!', 'success');
      setTimeout(() => router.push('/auth/sign-in'), 1000);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      showSnackbar(axiosErr.response?.data?.message || 'Registration failed', 'error');
    }
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/${provider}`; // Or use NextAuth logic
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Paper elevation={12} sx={{ p: 5, width: '100%' }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Create Your Account
          </Typography>

          <Stack direction="row" columnGap={1}>
            <TextField
              label="First Name"
              name="first_name"
              margin="normal"
              size="small"
              fullWidth
              value={form.first_name}
              onChange={handleChange}
            />

            <TextField
              label="Last Name"
              name="last_name"
              margin="normal"
              size="small"
              fullWidth
              value={form.last_name}
              onChange={handleChange}
            />
          </Stack>

          <TextField
            label="Email"
            name="email"
            margin="normal"
            size="small"
            type="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            margin="normal"
            size="small"
            type="password"
            fullWidth
            value={form.password}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Stack spacing={1}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => handleOAuth('google')}
              fullWidth
            >
              Sign up with Google
            </Button>

            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              onClick={() => handleOAuth('github')}
              fullWidth
            >
              Sign up with GitHub
            </Button>
          </Stack>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link href="/auth/sign-in" underline="hover">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* ✅ Snackbar from hook */}
      {SnackbarComponent}
    </Container>
  );
};

export default SignUpPage;
