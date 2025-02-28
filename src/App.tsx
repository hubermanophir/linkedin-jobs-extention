// import { useState } from "react";
import "./App.css";
// import Papa from "papaparse";

interface LinkedinJobElement extends Element {
  dataset?: {
    occludableJobId?: string;
  };
}

interface JobsWithDetails {
  description: string;
  jobId: string;
  url: string;
  company: string;
}

function App() {
  const jobsWithDetails: JobsWithDetails[] = [];
  // const [stopScraper, setStopScraper] = useState(false);
  const onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      args: [jobsWithDetails],
      func: async (jobsWithDetails: JobsWithDetails[]) => {
        const scrollElementEnd = (scrollableElement: HTMLElement) => {
          scrollableElement.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        };
        const scrollElementStart = (scrollableElement: HTMLElement) => {
          scrollableElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        };

        function wait(ms: number) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }

        const select = (document: Document, query: string, all = false) => {
          return all
            ? document.querySelectorAll(query)
            : document.querySelector(query);
        };

        const scrapePage = async () => {
          const jobsElement = select(
            document,
            ".scaffold-layout__list-item",
            true
          ) as NodeListOf<Element> | null;

          const jobElementList =
            jobsElement && (Array.from(jobsElement) as LinkedinJobElement[]);

          if (!jobElementList) {
            return;
          }
          const scrollableDiv = jobElementList[0].parentElement;

          if (!scrollableDiv) {
            return;
          }
          scrollElementEnd(scrollableDiv);
          await wait(2000);
          scrollElementStart(scrollableDiv);
          await wait(2000);

          const jobsIds = jobElementList.map(
            (job) => job.dataset?.occludableJobId
          );

          for (let index = 0; index < 2; index++) {
            const jobId = jobsIds[index];
            if (jobId) {
              const page = select(
                document,
                `[data-job-id="${jobId}"]`
              ) as HTMLElement | null;
              page && page.click();
              await wait(2000);

              const jobDescription = select(
                document,
                ".jobs-description__container"
              ) as HTMLElement | null;

              jobDescription && scrollElementEnd(jobDescription);
              const data = Object.create(null);
              data["description"] = jobDescription?.textContent;
              data["jobId"] = jobId;
              data["url"] = window.location.href;
              data["company"] = document
                .querySelector(
                  ".job-details-jobs-unified-top-card__company-name"
                )
                ?.textContent?.replace("\n", "")
                .trim();

              jobsWithDetails.push(data);
              await wait(3000);
            }
          }
        };

        let nextButton = document.querySelector(
          '[aria-label="View next page"]'
        ) as HTMLElement;

        // do {
        await wait(10000);
        await scrapePage();
        nextButton && nextButton.click();

        // } while (nextButton);
        // console.log("Done");
        console.log({ jobsWithDetails });
      },
    });
  };
  return (
    <>
      <div>
        <button style={{ width: 150 }} onClick={onclick}>
          Click to get Jobs Ids of page
        </button>
      </div>
    </>
  );
}

export default App;
