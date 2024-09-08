import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    GitHub,
    Resend,
    Google({
      authorization: {
        params: {
          authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        }
      }
    }),
  ],
});
