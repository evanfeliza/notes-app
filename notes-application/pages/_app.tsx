import '@/styles/globals.css'
import { AuthContextProvider } from '@/context/auth/AuthContext';
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import { Provider, cacheExchange, fetchExchange } from 'urql';
import { createClient } from '@urql/core';

const client = createClient({
  url: "https://todoappv1.onrender.com/query",
  requestPolicy: "cache-first",
  exchanges: [fetchExchange, cacheExchange],
});

const poppins = Poppins({
  weight: "400",
  style: "normal",
  subsets: ["latin"]
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider value={ client }>
      <AuthContextProvider>
          <main className={poppins.className}>  
            <Component {...pageProps} />
          </main>
      </AuthContextProvider>
    </Provider>
   
  );
}
