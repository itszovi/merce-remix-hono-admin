import { LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { getArticles } from "~/rpc/article"
import { DataTable } from "~/components/data-table"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Checkbox } from "~/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Article } from "schema"
import DOMPurify from "isomorphic-dompurify"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const articles = await getArticles()

  return articles
}

const columns: ColumnDef<Article>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const { slug } = row.original

      return (
        <Link
          className="text-blue-500 hover:text-blue-700"
          to={`/articles/${slug}`}
        >{`${DOMPurify.sanitize(row.original.title)}`}</Link>
      )
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => {
      const value = getValue() as string | null | undefined

      if (!value) return null

      return new Date(value).toLocaleString()
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ getValue }) => {
      const value = getValue() as string | null | undefined

      if (!value) return null

      return new Date(value).toLocaleString()
    },
  },
]

export default function Articles() {
  const articles = useLoaderData<typeof loader>()

  return (
    <div className="container m-auto flex h-full w-full">
      <div className="p-4">
        <DataTable columns={columns} data={articles} />
      </div>
    </div>
  )
}
