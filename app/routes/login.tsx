import {
  json,
  redirect,
  type LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getUserId, login } from "service/auth";
import { verifyUserPassword } from "repository/users";
import { createUserSession } from "service/auth";
import { Input } from "~/components/ui/input";

export async function action({ request }: ActionFunctionArgs){
  console.log(request);

  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) return;

  const user = await verifyUserPassword(username, password);

  if (!user) {
    return json({ message: "Invalid credentials" }, 401);
  }

  return createUserSession(request, user.id);
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  // console.log("userId:");
  console.log(userId);

  if (userId) return redirect("/dashboard");

  return json({});
};

export default function Login() {
  return (
    <div className="container m-auto flex h-full w-full min-h-full">
      <div className="mt-8 flex w-full flex-col justify-center gap-8 p-8">
        <div className="flex justify-center gap-2">
          <Form className="flex flex-col gap-4 p-4 bg-slate-600" method="post">
            <Input type="text" name="username" placeholder="username" />
            <Input type="password" name="password" placeholder="password" />
            <button type="submit">Login</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
