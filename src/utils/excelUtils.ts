import ExcelJS from "exceljs";
import type { MissingDevice, Row } from "../interfaces/interfaces.ts";
import { log } from "@clack/prompts";

export const writeCSV = async (filePath: string, data: Row[] = []): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const headers = Object.keys(data[0] as Row);
  worksheet.columns = headers.map((header) => ({ header, key: header }));

  data.forEach((row) => {
    worksheet.addRow(row);
  });

  await workbook.csv.writeFile(filePath);
};

export const exportXLSX = async (filePath: string, missingDevices: MissingDevice[]): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Missing Devices");

  worksheet.columns = [
    { header: "Manufacturer", key: "manufacturer", width: 20 },
    { header: "Full Name", key: "displayName", width: 40 },
    { header: "Device", key: "device", width: 20 },
    // { header: "Model", key: "modelName", width: 40 },
    { header: "Normalized Model", key: "normalizedName", width: 20 },
    { header: "Matching Device", key: "similarity", width: 40 },
  ];

  missingDevices.forEach((device) => {
    worksheet.addRow(device);
  });

  worksheet.autoFilter = "A1:C1";
  await workbook.xlsx.writeFile(filePath);

  log.success(`Missing devices exported to ${filePath}`);
};