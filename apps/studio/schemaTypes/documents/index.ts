import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { breed } from "./breed";
import { breedIndex } from "./breed-index";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { navbar } from "./navbar";
import { organisation } from "./organisation";
import { organisationIndex } from "./organisation-index";
import { page } from "./page";
import { redirect } from "./redirect";
import { settings } from "./settings";
import { sponsor } from "./sponsor";

export const singletons = [
  homePage,
  blogIndex,
  breedIndex,
  organisationIndex,
  settings,
  footer,
  navbar,
];

export const documents = [
  blog,
  page,
  faq,
  author,
  breed,
  organisation,
  ...singletons,
  redirect,
  sponsor,
];
