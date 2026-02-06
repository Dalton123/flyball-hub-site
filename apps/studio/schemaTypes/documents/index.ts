import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { breed } from "./breed";
import { breedIndex } from "./breed-index";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { navbar } from "./navbar";
import { page } from "./page";
import { redirect } from "./redirect";
import { settings } from "./settings";

export const singletons = [homePage, blogIndex, breedIndex, settings, footer, navbar];

export const documents = [blog, page, faq, author, breed, ...singletons, redirect];
