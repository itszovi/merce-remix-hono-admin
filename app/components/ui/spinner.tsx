import { LoaderCircle } from "lucide-react"
import React from "react"

import { cn } from "~/lib/classnames"

export const Spinner = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn("flex justify-center items-center", props.className)}
    >
      <LoaderCircle className="animate-spin h-8 w-8" />
    </div>
  )
}
