import { spinner, log, outro } from "@clack/prompts";
import type {
  MissingDevice,
  ACMRow,
  GooglePlayRow,
  Similarity,
} from "./interfaces/interfaces.ts";
import { exportXLSX, getFilePath, readCSV, writeCSV } from "./utils/index.js";
import { diceSorensen } from "./helpers/index.ts";

// Helper function for consistent string normalization
const normalizeString = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, "");
};

export const compareFiles = async (
  file1: string,
  file2: string
): Promise<void> => {
  const s = spinner();
  s.start("Reading CSV files...");

  const data1 = await readCSV<ACMRow>(file1, true);
  const data2 = await readCSV<GooglePlayRow>(file2, false);

  s.stop("CSV files read successfully!");

  // Process the first CSV (ACM Testing)
  const devices1 = data1
    .filter((row: ACMRow) => row["Device Name"] && row.Manufacturer)
    .map((row: ACMRow) => {
      let deviceName = row["Device Name"] || "";
      const manufacturer = row.Manufacturer || "";

      if (manufacturer === "Motorola") {
        deviceName = deviceName.replace(/\((\d{4})\)/, "- $1");
      }

      const displayName = deviceName.includes(manufacturer)
        ? deviceName
        : `${manufacturer} ${deviceName}`;

      return {
        displayName,
        normalizedName: normalizeString(displayName),
      };
    });

  const devices2 = data2.map((row: GooglePlayRow) => {
    let manufacturer = row.Manufacturer?.trim() || "";
    let name = row["Model Name"]?.trim() || "";
    const device = row.Device?.trim() || "";

    switch (manufacturer) {
      case "Redmi":
      case "POCO":
        manufacturer = "Xiaomi";
        break;
      case "Nothing":
        name = name.replace(/\((\d+)\)/g, " $1");
        break;
    }

    const displayName = name.includes(manufacturer)
      ? name
      : `${manufacturer} ${name}`;

    return {
      displayName,
      normalizedName: normalizeString(displayName),
      manufacturer,
      modelName: name,
      device,
    };
  });

  // Find missing devices
  const missingDevices: MissingDevice[] = devices2
    .map((device2) => {
      // Calculate similarity with all devices in devices1
      const similarities: Similarity[] = devices1
        .map((device1) => ({
          device: device1.displayName,
          similarity: diceSorensen({
            wordA: device1.normalizedName,
            wordB: device2.normalizedName,
          }),
        }))
        .filter(({ similarity }) => similarity >= 0.9 && similarity < 1);

      const similarity = similarities.map(
        ({ device, similarity }) =>
          `${device} (${(similarity * 100).toFixed(2)}%)`
      )

      if (similarities.length > 0) {
        return {
          ...device2,
          similarity: similarity.join(", "), // Join all similarities into a single string
        };
      }

      return {
        ...device2,
        similarity: ''
      }; // Exclude devices with no similarities
    })

  const filePath = getFilePath();

  if (missingDevices.length > 0) {
    await writeCSV(`${filePath}/modified_file1.csv`, devices1);
    await writeCSV(`${filePath}/modified_file2.csv`, devices2);
    await exportXLSX(`${filePath}/missing_devices.xlsx`, missingDevices);
  } else {
    log.warn("All devices in the second CSV are present in the first.");
  }

  outro("Process finalized");
};
