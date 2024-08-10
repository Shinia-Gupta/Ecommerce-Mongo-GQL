import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function initializeApollo(initialState = null) {
  const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "http://localhost:5000/graphql"
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });

  return client;
}
