import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Vektor Dashboard',
  description: 'Fleet management command center',
  icons: {
    icon: '/favicon.svg',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return children;
};

export default RootLayout;
