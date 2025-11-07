  import { createAuthClient } from "better-auth/react";

   export const authClient = createAuthClient();

//   import { createAuthClient } from "better-auth/client"
// import { adminClient } from "better-auth/client/plugins"
 
// export const authClient = createAuthClient({
//     plugins: [
//         adminClient()
//     ]
// })

export const { signIn, signOut, signUp, useSession } = authClient;
