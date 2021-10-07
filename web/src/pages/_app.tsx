import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import theme from '../theme';
import 'react-day-picker/lib/style.css';
import '../StyleOverrides.css';
import { MeProvider } from '../contexts/MeContext';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
