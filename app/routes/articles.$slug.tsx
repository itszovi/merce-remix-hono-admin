import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getArticleBySlug } from "~/rpc/article";
import { Article as OriginalArticle } from "schema";
import { Button } from "~/components/ui/button";
import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";
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
    <div className="container m-auto flex h-full w-full">
      <div className="p-4 w-full">
        <div className="w-full py-4 mb-4">
          <Button asChild>
            <Link to={`/articles/${data.article.slug}/edit`}>Edit</Link>
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
