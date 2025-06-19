// hoc/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/auth/login');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
