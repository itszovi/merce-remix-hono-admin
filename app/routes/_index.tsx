import {
  json,
  redirect,
  type LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { getUserId, login } from "service/auth";
import { verifyUserPassword } from "repository/users";
import { createUserSession } from "service/auth";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  // console.log("userId:");
  console.log(userId);

  if (userId) {
    return redirect("/dashboard")
  } else {
    return redirect("/login")
  }
};

export default function Index() {
  return (
    <div className="container m-auto flex h-full w-full">
      <div className="mt-8 flex w-full flex-col justify-center gap-8 p-8">
        <div className="flex justify-center gap-2">
        </div>
      </div>
    </div>
  );
}
