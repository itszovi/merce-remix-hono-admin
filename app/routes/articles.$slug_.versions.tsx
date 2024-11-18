import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  getArticleBySlug,
  getArticleVersions,
  updateArticle,
} from "~/rpc/article";
import { Article as OriginalArticle } from "schema";
import { Button } from "~/components/ui/button";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { DataTable } from "~/components/data-table";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { articles } from "config/tables";
import ReactDiffViewer from "react-diff-viewer-continued";

interface Article extends Omit<OriginalArticle, "createdAt" | "updatedAt"> {
  createdAt?: string | null | undefined;
  updatedAt?: string | null | undefined;
}
export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.slug === undefined) return redirect("/articles");

  const article = await getArticleBySlug(params.slug);

  if ("error" in article || !article.id) return redirect("/articles");

  const versions = await getArticleVersions(article.id);
  // const session = await getSession(request.headers.get("Cookie"));
  // const message = session.get("message") || null;

  // return json({ article, mesaage });

  return { article, versions };
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
    cell: ({ row }) => {
      const { id, slug } = row.original

      return (
        <Link
          className="text-blue-500 hover:text-blue-700"
          to={`/articles/${slug}/versions/${id}`}
        >{row.original.id}</Link>
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
      const value = getValue() as string | null | undefined;

      if (!value) return null;

      return `${new Date(value).toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })} ${new Date(value).toLocaleTimeString("hu-HU")}`;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ getValue }) => {
      const value = getValue() as string | null | undefined;

      if (!value) return null;

      return `${new Date(value).toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })} ${new Date(value).toLocaleTimeString("hu-HU")}`;
    },
  },
];

export default function ArticleEdit() {
  const {
    article,
    versions,
    // message
  } = useLoaderData<typeof loader>();

  return (
    <div className="container flex w-full h-full m-auto">
      <div className="w-full p-4">
        <div className="flex justify-between w-full gap-4 py-4 mb-8">
          <h1 className="text-4xl font-bold">{article.title}</h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link to={`/articles/${article.slug}/edit`}>Back</Link>
            </Button>
          </div>
        </div>
        <div className="p-4">
          <DataTable columns={columns} data={versions} />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        500: ({ params }) => <p>No note with the id exists</p>,
      }}
    />
  );
}
