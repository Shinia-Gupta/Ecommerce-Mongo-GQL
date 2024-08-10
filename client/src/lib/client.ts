import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function initializeApollo(initialState = null) {
  const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "https://ecommerce-mongo-lp37ppbjm-shinia-guptas-projects.vercel.app/"
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });

  return client;
}
