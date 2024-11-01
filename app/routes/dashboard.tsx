import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
// import { getUserSession } from "~/utils/session.server";
import { Form, Link } from "@remix-run/react";
import { Fragment } from "react/jsx-runtime";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    {
      name: "description",
      content: "Dashboard",
    },
  ];
};

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  // const session = await getUserSession(request);

  // console.log('session:');
  // console.log(session.data.user);

  // if (!session.data.user) return redirect("/n");

  return json({ msg: "ok" });
};

export default function Dashboard() {
  return (
    <Fragment>
      <header>
        <Form action="/logout" method="post">
          <button type="submit">Logout</button>
        </Form>
      </header>
      <div className="container m-auto flex h-full w-full">
        <div className="mt-8 flex w-full flex-col justify-center gap-8 p-8">
          <div className="flex justify-center gap-2">dashboard</div>
          <Link to={"/articles"}>Articles</Link>
        </div>
      </div>
    </Fragment>
  );
}
