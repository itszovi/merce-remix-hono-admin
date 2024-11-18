import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Link,
  Form,
  useLoaderData,
  useActionData,
  useSearchParams,
} from "@remix-run/react";
import {
  getArticleBySlug,
  getArticleVersions,
  updateArticle,
} from "~/rpc/article";
import { Article as OriginalArticle } from "schema";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { Toaster } from "~/components/ui/sonner";
import { SymbolIcon } from "@radix-ui/react-icons";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Field, WysiwygField } from "~/components/form";
import { toast } from "sonner";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { commitSession, getSession } from "utils/auth.server";
import { format } from "date-fns";
import { ClientOnly } from "remix-utils/client-only";
import { WysiwygEditor } from "~/components/wysiwyg";
import { useIsPending } from "utils/form";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { updateArticleSchema } from "schema/validator/article";

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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  console.log(formData);

  const id = formData.get("id");
  const slug = formData.get("slug");
  const title = formData.get("title");
  const path = formData.get("path");
  const lead = formData.get("lead");
  const content = formData.get("content");
  const publishedAt = formData.get("publishedAt");

  console.log("CONTENT HERE: ");
  console.log(content);

  console.log("id: " + id);
  console.log("slug: " + slug);
  console.log("title: " + title);
  console.log("path: " + path);
  console.log("lead: " + lead);
  console.log("publishedAt: " + publishedAt);

  // const updateResponse = await updateArticle({
  //   id: Number(id),
  //   slug: slug as string,
  //   title: title as string,
  //   path: path,
  //   lead: lead,
  //   content: content,
  //   publishedAt: publishedAt ?? undefined,
  // });

  // const { redirectTo, article } = updateResponse;

  // if (redirectTo !== false) return redirect(redirectTo as string);

  // const session = await getSession(request.headers.get("Cookie"));

  // session.flash("message", `Article updated!`);

  // return new Response(null, {
  //   status: 201,
  //   headers: {
  //     "Set-Cookie": await commitSession(session),
  //   },
  // });

  // return article;
  return {};
}

export default function ArticleEdit() {
  const { article, versions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const isPending = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
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

  const refreshSlug = () => {
    setSlug(slugify(title, { lower: true, strict: true, trim: false }));
  };

  useEffect(() => {
    if (isSlugTouched) return;
    setSlug(
      slugify(title, {
        lower: true,
        strict: true,
        trim: false,
      })
    );
  }, [title]);

  const [form, fields] = useForm({
    id: "edit-article-form",
    constraint: getZodConstraint(updateArticleSchema),
    defaultValue: { redirectTo },
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updateArticleSchema });
    },
    shouldRevalidate: "onBlur",
  });

  // console.log(article);
  console.log(versions);
  // console.log(message);

  // if (message) toast.success(message);

  return (
    <div className="container flex w-full h-full m-auto">
      <div className="w-full p-4">
        <div className="flex justify-between w-full gap-4 py-4 mb-8">
          <h1 className="text-4xl font-bold">
            {title.length > 0 ? title : "Add a title"}
          </h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link to={`/articles/${article.slug}`}>Back</Link>
            </Button>
            <Button
              variant="secondary"
              asChild
              disabled={versions.length === 0}
            >
              <Link to={`/articles/${article.slug}/versions`}>
                Versions ({versions.length})
              </Link>
            </Button>
            <Button variant="destructive" asChild>
              <Link to={`/articles/${article.slug}`}>Delete</Link>
            </Button>
          </div>
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
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col w-1/2 gap-4"
          {...getFormProps(form)}
        >
          <Input
            name="id"
            defaultValue={article.id}
            hidden
            className="hidden"
          />
          <Field
            labelProps={{
              children: "Title",
            }}
            inputProps={{
              ...getInputProps(fields.title, { type: "text" }),
              onChange: handleTitleChange,
              placeholder: "Article Title",
              value: title,
            }}
            errors={fields.title.errors}
          />
          <div className="flex gap-4 items-end">
            <Field
              className="w-full"
              labelProps={{
                children: "Slug",
              }}
              inputProps={{
                ...getInputProps(fields.slug, { type: "text" }),
                onChange: handleSlugChange,
                placeholder: "Article Slug",
                value: slug,
                onBlur: () => {
                  setIsSlugTouched(true);
                },
              }}
              errors={fields.slug.errors}
            />
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={refreshSlug}
              className="mt-4"
            >
              <SymbolIcon color="black" />
            </Button>
          </div>
          <Field
            labelProps={{
              children: "Path",
            }}
            inputProps={{
              ...getInputProps(fields.path, { type: "text" }),
              placeholder: "Article Path",
              defaultValue: article.path ?? undefined,
            }}
            errors={fields.path.errors}
          />
          <Field
            labelProps={{
              children: "Lead",
            }}
            inputProps={{
              ...getInputProps(fields.lead, { type: "text" }),
              placeholder: "Article Lead",
              defaultValue: article.lead ?? undefined,
            }}
            errors={fields.lead.errors}
          />
          <WysiwygField
            labelProps={{
              children: "Excerpt",
            }}
            inputProps={{
              ...getInputProps(fields.content, { type: "hidden" }),
              defaultValue: article.content,
            }}
          />
          <Field
            className="hidden"
            labelProps={{
              children: "Published at",
            }}
            inputProps={{
              ...getInputProps(fields.publishedAt, { type: "date" }),
              placeholder: "Article Published at",
              defaultValue: article.publishedAt ?? undefined,
            }}
            errors={fields.publishedAt.errors}
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
