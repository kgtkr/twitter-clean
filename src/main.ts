import { promises as fs } from "fs";
import Twit from "twit";

const T = new Twit({
  consumer_key: process.env["ck"]!,
  consumer_secret: process.env["cs"]!,
  access_token: process.env["tk"]!,
  access_token_secret: process.env["ts"]!,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

(async () => {
  const deletedIds = new Set(
    (await fs.readFile("./deleted_ids", { encoding: "utf8" }).catch(() => ""))
      .split("\n")
      .filter((id) => id.length !== 0)
  );

  const ids = (await fs.readFile("./ids", { encoding: "utf8" }))
    .split("\n")
    .filter((id) => id.length !== 0)
    .filter((id) => !deletedIds.has(id))
    .reverse();

  for (const id of ids) {
    try {
      await T.post("statuses/destroy/" + id);
      await fs.appendFile("./deleted_ids", id + "\n");
      console.log("deleted:", id);
    } catch (e) {
      if (e.statusCode === 404) {
        await fs.appendFile("./deleted_ids", id + "\n");
        console.log("not_fount:", id);
      } else {
        console.error("error:", id);
        console.error(e);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
})();
