import { Text } from '@chakra-ui/layout';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorContainer } from './ErrorContainer';

interface ErrorFallbackProps {
  showFullError?: boolean;
  message?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  children,
  showFullError,
  message,
}) => {
  const renderFallBack = () => {
    if (showFullError) return <ErrorContainer message={message} />;
    if (message?.length) return <Text>{message}</Text>;
    else return <div />;
  };

  return (
    <ErrorBoundary fallbackRender={renderFallBack}>{children}</ErrorBoundary>
  );
};
