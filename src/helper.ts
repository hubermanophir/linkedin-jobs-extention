import Papa from "papaparse";
import { JobsWithDetails } from "./types";

const downloadFile = (fileName: string, data: JobsWithDetails[]) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadCSV = (
  chunkSize = 0,
  jobsWithDetails: JobsWithDetails[]
) => {
  if (!chunkSize) {
    downloadFile("data", jobsWithDetails);
  } else {
    let index = 0;
    for (let offset = 0; offset < jobsWithDetails.length; offset += chunkSize) {
      const data = jobsWithDetails.slice(offset, offset + chunkSize);
      downloadFile(`data${index++}`, data);
    }
  }
};
