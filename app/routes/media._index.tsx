import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  UploadHandler,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { getArticles } from "~/rpc/article";
import { DataTable } from "~/components/data-table";
import { Button } from "~/components/ui/button";
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
import { Article } from "schema";
import DOMPurify from "isomorphic-dompurify";
import { formatImage } from "utils/image.server";
import { s3UploadHandler } from "utils/s3.server";
import { GeneralErrorBoundary } from "~/components/error-boundary";

// export const loader = async ({ params }: LoaderFunctionArgs) => {
// const articles = await getArticles();

// return articles;
// };

export const action = async ({ request }: ActionFunctionArgs) => {
  // const formData = await request.formData();
  // const file = formData.get("file") as File;

  // console.log(file);

  // const processedImageBuffer = await formatImage(await file.arrayBuffer(), 200);

  // console.log("result: " + processedImageBuffer);

  // // return redirect("/media");
  // return processedImageBuffer
  const uploadHandler: UploadHandler = composeUploadHandlers(
    s3UploadHandler,
    createMemoryUploadHandler()
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgSrc = formData.get("img");

  console.log(imgSrc);
  // const imgDesc = formData.get("desc");
  // console.log(imgDesc);
  if (!imgSrc) {
    return {
      errorMsg: "Something went wrong while uploading",
    };
  }
  return {
    imgSrc,
    // imgDesc,
  };
};

export default function Articles() {
  // const articles = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  console.log(result);

  return (
    <div className="container m-auto flex h-full w-full">
      <div className="p-4">
        <h1>Media</h1>
        <form method="post" encType="multipart/form-data">
          <input type="file" name="img" accept="image/jpg" />
          <button type="submit">Upload</button>
        </form>
        {result?.imgSrc && (
          <img src={result.imgSrc} alt="test" className="w-full h-full" />
        )}
      </div>
      <img src="https://mercetest2.s3.eu-central-1.amazonaws.com/images/1732064963256-434949418_17855489556153018_8081878331095636860_n.jpg" alt="" />
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
