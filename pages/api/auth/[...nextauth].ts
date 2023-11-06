import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const secret = process.env.NEXTAUTH_SECRET;

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: `${process.env.AUTH0_CLIENT_ID}`,
      clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
    }),
  ],
  secret: secret,
};

export default NextAuth(authOptions);
