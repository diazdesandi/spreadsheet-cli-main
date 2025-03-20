import ExcelJS from "exceljs";
import type { ACMRow, GooglePlayRow } from "../interfaces/interfaces.ts";

export const readCSV = async <T extends ACMRow | GooglePlayRow>(
  file: string, 
  isACM: boolean = false
): Promise<T[]> => {
  const workbook = new ExcelJS.Workbook();
  const csvFile = await workbook.csv.readFile(file);

  const rows: T[] = [];
  let headers: string[] = [];
  const headerRow = isACM ? 2 : 1;

  csvFile.eachRow((row, rowNumber) => {
    const values = row.values as string[];
    if (rowNumber === headerRow) {
      headers = values.map((value) => (typeof value === "string" ? value.trim() : ""));
    } else if (rowNumber > headerRow) {
      const rowObject = {} as T;
      headers.forEach((header, i) => {
        rowObject[header as keyof T] = values[i] ? String(values[i]).trim() as T[keyof T] : "" as T[keyof T];
      });
      rows.push(rowObject);
    }
  });

  return rows;
};

export const normalizeModel = (name: string): string => {
  return name.toLowerCase().trim().replace(/\s+/g, "");
};