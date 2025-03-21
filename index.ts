#!/usr/bin/env node
import { intro, select } from "@clack/prompts";
import { compareFiles } from "./src/compareFiles.ts";
import { getCSVFiles } from "./src/utils/index.ts";

intro("Compare ACM Testing and Google Play CSV files");

const acmTestingCSV = (await select({
  message: "Select the ACM Testing CSV",
  options: await getCSVFiles(),
})) as string;

const googlePlayCSV = (await select({
  message: "Select the CSV file downloaded from the Google Play Console",
  options: await getCSVFiles(),
})) as string;

await compareFiles(acmTestingCSV, googlePlayCSV);