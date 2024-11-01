import { Article } from "schema"
import { format } from "date-fns"

/**
 * format article publish times to url path
 */

export const formatArticlePublishDateToPath = (publishDate: string): string => {
  return format(new Date(publishDate), "yyyy/MM/dd")
}

/**
 * create path from slug and date
 */

export const formatArticleSlugAndDateToPath = (slug: string, datePath: string): string => {
  console.log({
    slug,
    datePath
  })
  return datePath ? `/${datePath}/${slug}/` : `/${slug}/`
}