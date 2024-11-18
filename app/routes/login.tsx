import {
  redirect,
  type LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { getUserId, login } from "service/auth";
import { verifyUserPassword } from "repository/users";
import { createUserSession } from "service/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { loginUserSchema } from "schema/validator/user";
import { useIsPending } from "utils/form";
import { Field } from "~/components/form";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const username = formData.get("user_name");
  const password = formData.get("password");

  const user = await verifyUserPassword(username, password);

  if (!user) {
    return { message: "Invalid credentials", status: 401 };
  }

  return createUserSession(request, user.id);
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  // console.log("userId:");
  console.log("userId: " + userId);

  if (userId) return redirect("/dashboard");

  return null;
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const isPending = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [form, fields] = useForm({
    id: "login-form",
    constraint: getZodConstraint(loginUserSchema),
    defaultValue: { redirectTo },
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginUserSchema });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <div className="container m-auto flex h-full w-full min-h-full">
      <div className="mt-8 flex w-full flex-col justify-center gap-8 p-8">
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" {...getFormProps(form)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Field
                    labelProps={{
                      children: "Username",
                    }}
                    inputProps={{
                      ...getInputProps(fields.user_name, { type: "text" }),
                      placeholder: "username"
                    }}
                    errors={fields.user_name.errors}
                  />
                </div>
                <div className="space-y-2">
                <Field
                    labelProps={{
                      children: "Password",
                    }}
                    inputProps={{
                      ...getInputProps(fields.password, { type: "password" }),
                      placeholder: "password"
                    }}
                    errors={fields.password.errors}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
