import { promises as fs } from "fs";

const gThis = globalThis as any;

gThis.window = gThis.window || {};
gThis.window.YTD = gThis.window.YTD || {};
gThis.window.YTD.tweet = gThis.window.YTD.tweet || {};
require("../tweet");

const tweets = gThis.window.YTD.tweet.part0;

(async () => {
  for (const id of tweets
    .map(({ tweet }: any) => tweet)
    .filter(
      ({ created_at }: any) =>
        new Date(process.env["since"]!) <= new Date(created_at) &&
        new Date(created_at) <= new Date(process.env["until"]!)
    )
    .map(({ id_str }: any) => id_str)) {
    await fs.appendFile("./ids", id + "\n");
  }
})();
