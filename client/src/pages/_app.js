import { ApolloProvider } from "@apollo/client";
import { initializeApollo } from "../lib/client";
import Navbar from '../components/Navbar'
import '../app/globals.css';

function MyApp({ Component, pageProps }) {
  const client = initializeApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
        <Navbar/>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
