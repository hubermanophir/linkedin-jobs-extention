import { useEffect, useState } from "react";
import "./App.css";
import Scraper from "./scraper/Scraper";
import { downloadCSV } from "./helper";
import { JobsWithDetails } from "./types";

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

  return (
    <>
      <div>
        <Scraper />
        {finishExtracting ? (
          <button onClick={() => downloadCSV(30, jobsWithDetails)}>
            Click to download data
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default App;
