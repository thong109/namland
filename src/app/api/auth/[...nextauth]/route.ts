import NextAuth, { NextAuthOptions } from 'next-auth';
import { Provider } from 'next-auth/providers';
import CredentialsProvider from 'next-auth/providers/credentials';
import authApiService from '../../../../apiServices/externalApiServices/authApiService';
import AuthConstant from '../../../../libs/constants/authConstant';

const nextProviders: Provider[] = [
  CredentialsProvider({
    id: AuthConstant.CredentialProviderName,
    name: AuthConstant.CredentialProviderName,
    credentials: {
      username: { label: 'username', type: 'text' },
      password: { label: 'password', type: 'password' },
    },
    async authorize(credentials, req) {
      if (credentials) {
        const response = await authApiService.login({
          username: credentials.username,
          password: credentials.password,
        });

        if (response.success && response.data) {
          return {
            accessToken: response.data.token,
          } as any;
        }
      }
      return null;
    },
  }),
];

const nextAuthOptions: NextAuthOptions = {
  providers: nextProviders,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token, user }) {
      if (token['accessToken']) {
        session['accessToken'] = token['accessToken'];
      }
      return session;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user && user['accessToken']) {
        token['accessToken'] = user['accessToken'];
      }
      if (trigger === 'update') {
        if (session?.lang) {
          token['lang'] = session?.lang;
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
