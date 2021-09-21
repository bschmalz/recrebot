import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';
import { NextPageContext } from 'next';

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    headers: {
      cookie:
        typeof window === 'undefined' ? ctx?.req?.headers.cookie : undefined,
    },
    cache: new InMemoryCache({}),
    credentials: 'include' as const,
  });

export const withApollo = createWithApollo(createClient);
