import { useEffect, useState } from "react";
import "./App.css";
import Papa from "papaparse";
import Scraper from "./scraper/Scraper";


interface JobsWithDetails {
  description: string;
  jobId: string;
  url: string;
  company: string;
}

function App() {
  const [jobsWithDetails, setJobsWithDetails] = useState<JobsWithDetails[]>([]);
  const [finishExtracting, setFinishExtracting] = useState(false);

  useEffect(() => {
    const messageListener = (message: {
      type: string;
      data: JobsWithDetails;
    }) => {
      if (message.type === "UPDATE_DATA") {
        setJobsWithDetails((prevData) => [...prevData, message.data]);
      }
      if (message.type === "FINISH") {
        setFinishExtracting(true);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

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

  const downloadCSV = (chunkSize = 0) => {
    if (!chunkSize) {
      downloadFile("data", jobsWithDetails);
    } else {
      let index = 0;
      for (
        let offset = 0;
        offset < jobsWithDetails.length;
        offset += chunkSize
      ) {
        const data = jobsWithDetails.slice(offset, offset + chunkSize);
        downloadFile(`data${index++}`, data);
      }
    }
  };

  return (
    <>
      <div>
        <Scraper />
        {finishExtracting ? (
          <button onClick={() => downloadCSV(30)}>
            Click to download data
          </button>
        ) : (
          <></>
        )}
        <button onClick={async () => {}}>Stop scraper</button>
      </div>
    </>
  );
}

export default App;
