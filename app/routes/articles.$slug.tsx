import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getArticleBySlug, getArticleVersions } from "~/rpc/article";
import { Article as OriginalArticle } from "schema";
import { Button } from "~/components/ui/button";
import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";
import { format } from "date-fns";
interface Article extends Omit<OriginalArticle, "createdAt" | "updatedAt"> {
  createdAt?: string | null | undefined;
  updatedAt?: string | null | undefined;
}
export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.slug === undefined) return redirect("/articles");

  console.log("helyzet?");

  const article = await getArticleBySlug(params.slug);

  if ("error" in article) throw new Error("not found");

  return json({ article });
};

export default function Article() {
  const data = useLoaderData<typeof loader>();
  const { article } = data;

  console.log(data.article);

  return (
    <div className="container flex w-full h-full m-auto">
      <div className="w-full p-4">
        <div className="flex w-full gap-4 py-4 mb-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="">Status:</span>
            {article.publishedAt ? (
              <span className="font-bold">Published</span>
            ) : (
              <span className="font-bold">Draft</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="">Published at:</span>
            {article.publishedAt && (
              <time className="font-bold">
                {format(article.publishedAt, "MMMM d, yyyy")}
              </time>
            )}
          </div>
          {article.updatedAt && (
            <div className="flex items-center gap-2 text-sm">
              <span className="">Last updated:</span>
              <time className="font-bold">
                {format(article.updatedAt, "MMMM d, yyyy")}
              </time>
            </div>
          )}
          <Button asChild>
            <Link to={`/articles/${article.slug}/edit`}>Edit</Link>
          </Button>
        </div>
        <h2
          className="text-3xl font-bold tracking-tight"
          dangerouslySetInnerHTML={{
            __html: parse(DOMPurify.sanitize(article.title)) as string,
          }}
        />
        <div>{parse(DOMPurify.sanitize(article.content))}</div>
      </div>
    </div>
  );
}
