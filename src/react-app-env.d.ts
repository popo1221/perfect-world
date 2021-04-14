/// <reference types="react-scripts" />

declare module "@mui-treasury/styles/cardMedia/fourThree";
declare module "@mui-treasury/styles/input/search";

declare interface Site {
  title: string;
  subtitle: string;
  image: string;
  color: string;
  url: string
  category: string
}
declare var site_db: Site[];