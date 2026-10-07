import "server-only";
import sanitizeHtml from "sanitize-html";

/** Allow the formatting Tiptap produces, nothing else. */
export function sanitizeRichText(html: string | null) {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "a", "h2", "h3", "ul", "ol", "li",
      "blockquote", "hr", "img", "figure", "figcaption",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
