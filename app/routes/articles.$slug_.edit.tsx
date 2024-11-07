import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, Form, useLoaderData } from "@remix-run/react";
import { getArticleBySlug, getArticleVersions, updateArticle } from "~/rpc/article";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Checkbox } from "~/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Article as OriginalArticle } from "schema";
import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Toaster } from "~/components/ui/sonner";
import { toast } from "sonner";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { commitSession, getSession } from "utils/auth.server";
import { format } from "date-fns";
import { WysiwygEditor } from "~/components/wysiwyg";

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

  return json({ article, versions });
}

export async function action({ request }: ActionFunctionArgs) {
  console.log(request);
  console.log("action");

  const formData = await request.formData();
  const id = formData.get("id");
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const path = formData.get("path") as string | undefined;
  const lead = formData.get("lead") as string;
  const content = formData.get("content") as string;
  const publishedAt = formData.get("publishedAt") as string;

  if (!id || !title || !slug) return json({ error: "missing data" });

  const updateResponse = await updateArticle({
    id: Number(id),
    slug: slug as string,
    title: title as string,
    path: path,
    lead: lead,
    content: content,
    publishedAt: publishedAt ?? undefined,
  });

  const { redirectTo, article } = updateResponse;

  if (redirectTo !== false) return redirect(redirectTo as string);

  // const session = await getSession(request.headers.get("Cookie"));

  // session.flash("message", `Article updated!`);

  // return new Response(null, {
  //   status: 201,
  //   headers: {
  //     "Set-Cookie": await commitSession(session),
  //   },
  // });

  return json({ article });
}

export default function ArticleEdit() {
  const {
    article,
    versions
    // message
  } = useLoaderData<typeof loader>();
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(
      slugify(e.target.value, {
        lower: true,
        strict: true,
        trim: true,
      })
    );
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(
      slugify(e.target.value, {
        lower: true,
        strict: true,
        trim: false,
      })
    );
  };

  // console.log(article);
  console.log(versions);
  // console.log(message);

  // if (message) toast.success(message);

  return (
    <div className="container flex w-full h-full m-auto">
      <div className="w-full p-4">
        <div className="flex w-full gap-4 py-4 mb-8">
          <h1 className="text-4xl font-bold">{article.title}</h1>
          <Button asChild>
            <Link to={`/articles/${article.slug}`}>Back</Link>
          </Button>
        </div>
        <div className="flex w-full gap-4 py-4 mb-8 border-b zinc-800">
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
        </div>
        <Form
          id="article-form"
          method="post"
          encType="multipart/form-data"
          className="flex flex-col w-1/2 gap-4"
        >
          <Input
            name="id"
            defaultValue={article.id}
            hidden
            className="hidden"
          />
          <Label htmlFor="title">Title</Label>
          <Input
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Article Title"
          />
          <Label htmlFor="slug">Slug</Label>
          <Input
            name="slug"
            value={slug}
            onChange={handleSlugChange}
            placeholder="article-slug"
          />
          <Input
            name="path"
            defaultValue={article.path ?? undefined}
            hidden
            className="hidden"
          />
          <Label htmlFor="lead">Lead</Label>
          <Input
            name="lead"
            defaultValue={article.lead ?? ""}
            placeholder="Article lead"
          />
          <Label htmlFor="content">Content</Label>
          <WysiwygEditor name="content" defaultValue={article.content ? article.content.replaceAll("\\n", "") : ""} />
          <Input
            name="publishedAt"
            defaultValue={article.publishedAt ?? undefined}
            hidden
            className="hidden"
          />
          <Button type="submit">Save</Button>
        </Form>
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
