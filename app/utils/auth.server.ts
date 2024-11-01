
// import { redirect } from "@remix-run/node";
// import { Authenticator, AuthorizationError } from "remix-auth";
// import { FormStrategy } from "remix-auth-form";
// import { authSessionStorage } from "utils/auth.server";
// import ky from 'ky';

// export const auth = new Authenticator<string>(authSessionStorage);

// export const sessionKey = 'sessionId'

// export async function logout(request: Request) {
//   let session = await authSessionStorage.getSession(request.headers.get("Cookie"));

  
//   return redirect("/", {
//     headers: { "Set-Cookie": await authSessionStorage.destroySession(session) },
//   });
// }