import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  getArticleBySlug,
  getArticleVersionById,
  getArticleVersions,
  updateArticle,
} from "~/rpc/article";
import { Article as OriginalArticle } from "schema";
import { Button } from "~/components/ui/button";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { articles } from "config/tables";
import ReactDiffViewer from "react-diff-viewer-continued";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.slug === undefined) return redirect("/articles");

  console.log("params.slug: " + params.slug);
  console.log("params.id: " + params.id);

  const article = await getArticleBySlug(params.slug);

  if ("error" in article || !article.id) return redirect("/articles");

  const version = await getArticleVersionById(article.id, Number(params.id));
  // const session = await getSession(request.headers.get("Cookie"));
  // const message = session.get("message") || null;

  // return json({ article, mesaage });

  return { article, version };
}

export default function ArticleEdit() {
  const {
    article,
    version,
    // message
  } = useLoaderData<typeof loader>();

  console.log(article);
  console.log(version);

  return (
    <div className="container flex w-full h-full m-auto">
      <div className="w-full p-4">
        <div className="flex justify-between w-full gap-4 py-4 mb-8">
          <h1 className="text-4xl font-bold">{article.title}</h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link to={`/articles/${article.slug}/versions`}>Back</Link>
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h2>hehe</h2>
          <ReactDiffViewer oldValue={article.content} newValue={version.content} splitView={true} />
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
