import tailwind from "~/styles/globals.css?url"
import { LinksFunction } from "@remix-run/server-runtime"
import { Toaster } from "~/components/ui/sonner"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {/* <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 200000,
          }}
          richColors
          expand={true}
        /> */}
      </body>
    </html>
  )
}
