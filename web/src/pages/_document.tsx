import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import theme from '../theme';
export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta name='application-name' content='Recrebot' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta
            name='apple-mobile-web-app-status-bar-style'
            content='default'
          />
          <meta name='apple-mobile-web-app-title' content='Recrebot' />
          <meta
            name='description'
            content='Campground and Trail Permit Finder'
          />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='msapplication-TileColor' content='#2B5797' />
          <meta name='msapplication-tap-highlight' content='no' />
          <meta name='theme-color' content='#000000' />

          <link
            rel='apple-touch-icon'
            href='/static/icons/touch-icon-iphone.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='152x152'
            href='/icons/apple-touch-icon-152x152.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/icons/apple-touch-icon-180x180.png'
          />

          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/icons/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/icons/favicon-16x16.png'
          />
          <link rel='manifest' href='/manifest.json' />
          <link rel='mask-icon' href='/icons/maskable.png' color='#5bbad5' />
          <link rel='shortcut icon' href='/icons/favicon.ico' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500'
          />

          <meta property='og:type' content='website' />
          <meta property='og:title' content='Recrebot' />
          <meta
            property='og:description'
            content='Campground and Trail Permit Finder'
          />
          <meta property='og:site_name' content='Recrebot' />
          <meta property='og:url' content='https://recrebot.com' />
          <meta
            property='og:image'
            content='https://recrebot.com/matlock.jpg'
          />
        </Head>
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
