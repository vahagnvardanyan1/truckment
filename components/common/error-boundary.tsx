'use client';

import { Component, ReactNode } from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { ErrorOutlined, RefreshOutlined, HomeOutlined } from '@mui/icons-material';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            p: 4,
          }}
        >
          <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
            <CardContent sx={{ py: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: 'error.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <ErrorOutlined sx={{ fontSize: 32, color: 'error.main' }} />
              </Box>

              <Typography variant="h5" fontWeight={600} gutterBottom>
                Something went wrong
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
              </Typography>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <Box
                  component="pre"
                  sx={{
                    textAlign: 'left',
                    p: 2,
                    mb: 3,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.75rem',
                    maxHeight: 200,
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                >
                  Go Home
                </Button>
                <Button
                  variant="contained"
                  startIcon={<RefreshOutlined />}
                  onClick={this.handleRetry}
                >
                  Try Again
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary wrapper for functional components
interface UseErrorBoundaryReturn {
  ErrorBoundaryWrapper: React.ComponentType<{ children: ReactNode }>;
  resetError: () => void;
}

// Simple functional wrapper
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
