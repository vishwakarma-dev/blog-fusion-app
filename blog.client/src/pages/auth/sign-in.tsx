import { useState, ChangeEvent } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Divider,
  Link
} from '@mui/material';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import api from '@Blog/lib/axios';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useSnackbar } from '@Blog/hooks/useSnackbar'; // Adjust path as needed

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const handleSubmit = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', res.data.token);
      showSnackbar('Login successful!', 'success');
      setTimeout(() => router.push('/blog'), 1000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Login failed';
      showSnackbar(message, 'error');
    }
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Paper elevation={8} sx={{ p: 5, width: '100%', borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Sign In
          </Typography>

          <TextField
            label="Email"
            size="small"
            margin="normal"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            size="small"
            margin="normal"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            fullWidth
          />

          <Box textAlign="right" mt={1}>
            <Link href="/auth/forgot-password" underline="hover" variant="body2">
              Forgot your password?
            </Link>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ mt: 4, py: 1 }}
            onClick={handleSubmit}
            fullWidth
          >
            Sign In
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Stack direction="column" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={() => handleOAuth('google')}
            >
              Sign in with Google
            </Button>
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              fullWidth
              onClick={() => handleOAuth('github')}
            >
              Sign in with GitHub
            </Button>
          </Stack>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Don’t have an account?{' '}
              <Link href="/auth/sign-up" underline="hover">
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {SnackbarComponent}
    </Container>
  );
};

export default SignInPage;
