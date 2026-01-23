'use client';

import { Box, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface SkipLink {
  href: string;
  label: string;
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
];

interface SkipLinksProps {
  links?: SkipLink[];
}

export function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  const theme = useTheme();

  return (
    <Box
      component="nav"
      aria-label="Skip links"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: theme.zIndex.tooltip + 1,
      }}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          sx={{
            position: 'absolute',
            left: '-10000px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            '&:focus': {
              position: 'fixed',
              top: 16,
              left: 16,
              width: 'auto',
              height: 'auto',
              overflow: 'visible',
              bgcolor: 'background.paper',
              color: 'primary.main',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              fontWeight: 600,
              textDecoration: 'none',
              zIndex: theme.zIndex.tooltip + 1,
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          }}
        >
          {link.label}
        </Link>
      ))}
    </Box>
  );
}
