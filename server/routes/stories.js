import { Router } from "express";
import { parseArticleDigestFile, parseStoryBankFile } from "../careerOps/parsers/stories.js";
import { writeArticleDigestFile, writeStoryBankFile } from "../careerOps/writers/stories.js";

export function createStoriesRouter(config) {
  const router = Router();

  router.get("/story-bank", async (_req, res, next) => {
    try {
      res.json(await parseStoryBankFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.put("/story-bank", async (req, res, next) => {
    try {
      await writeStoryBankFile(config, req.body?.raw || "", req.headers["if-match"]);
      res.json(await parseStoryBankFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.get("/article-digest", async (_req, res, next) => {
    try {
      res.json(await parseArticleDigestFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.put("/article-digest", async (req, res, next) => {
    try {
      await writeArticleDigestFile(config, req.body?.raw || "", req.headers["if-match"]);
      res.json(await parseArticleDigestFile(config));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
