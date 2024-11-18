import { redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { getUserId, login } from "service/auth"

export async function loader({ context, request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)

  if (userId) {
    return redirect("/dashboard")
  } else {
    return redirect("/login")
  }
}

export default function Index() {
  return (
    <div className="container flex w-full h-full m-auto">
      <div className="flex flex-col justify-center w-full gap-8 p-8 mt-8">
        <div className="flex justify-center gap-2"></div>
      </div>
    </div>
  )
}
