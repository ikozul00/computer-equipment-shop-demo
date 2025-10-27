import type { AppProps } from 'next/app'
import { Layout } from '../src/components/Layout';
import { SessionProvider } from 'next-auth/react';
import '../src/styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps?.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}