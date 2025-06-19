import * as React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

interface Props {
  window?: () => Window;
  children?: React.ReactElement;
}

export default function ScrollTop(props: Props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  };

  return (
    <Fade in={trigger} timeout={{ enter: 1800, exit: 1000 }}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: (theme) => theme.zIndex.tooltip,
          transition: 'opacity 1.5s ease, transform 1.2s ease',
          '& > *': {
            transition: 'opacity 1.5s ease, transform 1.2s ease',
            transform: trigger ? 'scale(1)' : 'scale(0.8)',
            opacity: trigger ? 1 : 0,
          },
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}
