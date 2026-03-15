import { useEffect } from "react";
import { useLocation } from "react-router";
import { algorithmCatalog } from "../data/catalog";

const SITE_NAME = "AlgoViz";
const SITE_URL = "https://algoviz-phi.vercel.app";
const DEFAULT_TITLE = "AlgoViz | Interactive Algorithm and Data Structure Visualizer";
const DEFAULT_DESCRIPTION =
  "Explore searching, sorting, graph algorithms, dynamic programming, data structures, and trees through interactive visualizations.";

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

function getPageMetadata(pathname: string) {
  if (pathname === "/") {
    return {
      title: DEFAULT_TITLE,
      description:
        "Learn algorithms visually with interactive modules for searching, sorting, graphs, dynamic programming, trees, and data structures.",
      keywords:
        "algorithm visualizer, data structure visualizer, searching algorithms, sorting algorithms, graph algorithms, dynamic programming, React project",
    };
  }

  for (const category of algorithmCatalog) {
    const match = category.algorithms.find((algorithm) => algorithm.path === pathname);

    if (match) {
      return {
        title: `${match.name} Visualizer | ${SITE_NAME}`,
        description: `${match.name} interactive visualization in AlgoViz. ${match.blurb} Study ${category.title.toLowerCase()} with step-by-step playback, controls, and reference code.`,
        keywords: `${match.name}, ${category.title}, algorithm visualization, data structure visualization, AlgoViz`,
      };
    }
  }

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    keywords: "algorithm visualizer, data structure visualizer, AlgoViz",
  };
}

export default function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    const { title, description, keywords } = getPageMetadata(location.pathname);
    const canonicalUrl = `${SITE_URL}${location.pathname}`;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });

    upsertLink("canonical", canonicalUrl);
  }, [location.pathname]);

  return null;
}
