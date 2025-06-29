import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

// Error categories for better handling
enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  RENDER = 'render',
  ASYNC = 'async',
  UNKNOWN = 'unknown',
}

function categorizeError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase();

  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return ErrorCategory.NETWORK;
  }
  if (message.includes('validation') || message.includes('invalid')) {
    return ErrorCategory.VALIDATION;
  }
  if (message.includes('render') || message.includes('jsx') || message.includes('component')) {
    return ErrorCategory.RENDER;
  }
  if (error.name === 'ChunkLoadError' || message.includes('loading chunk')) {
    return ErrorCategory.NETWORK;
  }

  return ErrorCategory.UNKNOWN;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // React 19 enhanced error handling - generate unique error ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // React 19 enhanced error logging with categorization
    const category = categorizeError(error);
    const enhancedError = {
      ...error,
      category,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      retryCount: this.state.retryCount,
    };

    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Category:', category);
    console.error('Error Info:', errorInfo);
    console.error('Enhanced Details:', enhancedError);
    console.groupEnd();

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // React 19 - Report to error tracking service
    if (typeof window !== 'undefined') {
      // In a real app, you'd use your error tracking service here
      // trackError(enhancedError, errorInfo);

      // Store error in session storage for debugging
      try {
        const errorLog = {
          id: this.state.errorId,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          errorInfo,
          enhancedError,
        };
        sessionStorage.setItem(`error_${this.state.errorId}`, JSON.stringify(errorLog));
      } catch (e) {
        console.warn('Failed to store error in session storage:', e);
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Auto-reset on props change (React 19 pattern)
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.handleReset();
    }

    // Reset on key changes
    if (hasError && resetKeys && prevProps.resetKeys !== resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index],
      );
      if (hasResetKeyChanged) {
        this.handleReset();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  handleReset = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleAutoRetry = () => {
    const maxRetries = 3;
    if (this.state.retryCount < maxRetries) {
      // Auto-retry after delay (React 19 pattern)
      this.resetTimeoutId = window.setTimeout(
        () => {
          this.handleReset();
        },
        2000 * (this.state.retryCount + 1),
      ); // Exponential backoff
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const category = categorizeError(this.state.error);
      const canRetry = this.state.retryCount < 3;

      return (
        <Card variant='default' className='mx-auto max-w-2xl mt-8'>
          <div className='text-center'>
            <div className='mb-4'>
              {category === ErrorCategory.NETWORK ? (
                <div className='text-6xl mb-2'>🌐</div>
              ) : category === ErrorCategory.VALIDATION ? (
                <div className='text-6xl mb-2'>⚠️</div>
              ) : category === ErrorCategory.RENDER ? (
                <div className='text-6xl mb-2'>🔧</div>
              ) : (
                <div className='text-6xl mb-2'>💥</div>
              )}
            </div>

            <h2 className='text-2xl font-bold text-red-600 mb-4'>
              {category === ErrorCategory.NETWORK && 'Connection Problem'}
              {category === ErrorCategory.VALIDATION && 'Validation Error'}
              {category === ErrorCategory.RENDER && 'Display Error'}
              {category === ErrorCategory.UNKNOWN && 'Something went wrong'}
            </h2>

            <p className='text-gray-600 mb-6'>
              {category === ErrorCategory.NETWORK &&
                'Unable to connect to the server. Please check your internet connection.'}
              {category === ErrorCategory.VALIDATION &&
                "The data provided doesn't meet the required format."}
              {category === ErrorCategory.RENDER && 'There was a problem displaying this content.'}
              {category === ErrorCategory.UNKNOWN &&
                'We encountered an unexpected error. Please try again.'}
            </p>

            {this.state.retryCount > 0 && (
              <div className='mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <p className='text-yellow-800 text-sm'>
                  Retry attempt {this.state.retryCount} of 3
                </p>
              </div>
            )}

            <div className='flex gap-4 justify-center mb-6'>
              {canRetry && (
                <Button onClick={this.handleReset} variant='primary'>
                  Try Again
                </Button>
              )}

              {category === ErrorCategory.NETWORK && (
                <Button onClick={this.handleAutoRetry} variant='secondary'>
                  Auto Retry in 2s
                </Button>
              )}

              <Button onClick={() => window.location.reload()} variant='secondary'>
                Refresh Page
              </Button>

              <Button onClick={() => window.history.back()} variant='secondary'>
                Go Back
              </Button>
            </div>

            {/* Error ID for support */}
            {this.state.errorId && (
              <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
                <p className='text-gray-600 text-sm'>
                  Error ID: <code className='font-mono text-xs'>{this.state.errorId}</code>
                </p>
              </div>
            )}

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && (
              <details className='text-left bg-gray-50 p-4 rounded-lg'>
                <summary className='cursor-pointer font-medium text-gray-800 mb-2'>
                  🔍 Error Details (Development Only)
                </summary>

                <div className='space-y-3'>
                  <div>
                    <h4 className='font-semibold text-sm text-gray-700'>Error Category:</h4>
                    <p className='text-sm bg-red-100 text-red-800 px-2 py-1 rounded inline-block'>
                      {category}
                    </p>
                  </div>

                  <div>
                    <h4 className='font-semibold text-sm text-gray-700'>Error Message:</h4>
                    <pre className='text-sm text-red-600 bg-red-50 p-2 rounded overflow-auto'>
                      {this.state.error.toString()}
                    </pre>
                  </div>

                  {this.state.errorInfo && (
                    <div>
                      <h4 className='font-semibold text-sm text-gray-700'>Component Stack:</h4>
                      <pre className='text-sm text-gray-600 bg-gray-100 p-2 rounded overflow-auto max-h-32'>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}

                  {this.state.error.stack && (
                    <div>
                      <h4 className='font-semibold text-sm text-gray-700'>Stack Trace:</h4>
                      <pre className='text-sm text-gray-600 bg-gray-100 p-2 rounded overflow-auto max-h-32'>
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

// React 19 enhanced error handling hooks
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    const category = categorizeError(error);

    console.group('🔥 Unhandled Error');
    console.error('Error:', error);
    console.error('Category:', category);
    console.error('Error Info:', errorInfo);
    console.groupEnd();

    // In a real app, report to error tracking service
    if (typeof window !== 'undefined') {
      // trackError({ ...error, category }, errorInfo);
    }
  };
}

// React 19 pattern for error recovery
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Error categories export for use in other components
export { ErrorCategory, categorizeError };
