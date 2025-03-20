import { cwd } from "node:process";
import { promises } from "node:fs";
import { join } from "node:path";

export const getFilePath = () => join(cwd());

export const readDirectory = async (dirPath: string): Promise<string[]> => {
  try {
    return await promises.readdir(dirPath);
  } catch {
    throw new Error("Failed to read directory");
  }
};

export const getCSVFiles = async (): Promise<{ value: string; label: string }[]> => {
  const filePath = getFilePath();
  const files = await readDirectory(filePath);
  const csvFiles = files
    .filter((file) => file.endsWith(".csv"))
    .map((file) => ({
      value: join(filePath, file),
      label: file,
    }));

  if (csvFiles.length === 0) {
    throw new Error("No CSV files available");
  }

  return csvFiles;
};