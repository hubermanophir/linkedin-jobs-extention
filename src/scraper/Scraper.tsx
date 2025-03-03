import { LinkedinJobElement } from "../types";

export default function Scraper() {
  const onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      args: [],
      func: async () => {
        const getRandomNumber = (min: number, max: number): number => {
          if (min > max) {
            [min, max] = [max, min];
          }
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };

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

          for (let index = 0; index < jobsIds.length; index++) {
            const jobId = jobsIds[index];
            if (!jobId) {
              return;
            }

            const page = select(
              document,
              `[data-job-id="${jobId}"]`
            ) as HTMLElement | null;
            if (!page) {
              return;
            }
            page.click();
            await wait(getRandomNumber(2000, 3000));

            const jobDescription = select(
              document,
              ".jobs-description__container"
            ) as HTMLElement | null;
            if (!jobDescription) {
              return;
            }
            scrollElementEnd(jobDescription);
            const data = Object.create(null);
            data["description"] = jobDescription?.textContent;
            data["jobId"] = jobId;
            data["url"] = window.location.href;
            data["company"] = document
              .querySelector(".job-details-jobs-unified-top-card__company-name")
              ?.textContent?.replace("\n", "")
              .trim();
            data["employers_amount"] = document.querySelector(
              ".jobs-company__inline-information"
            )?.textContent;
            chrome.runtime.sendMessage({
              type: "UPDATE_DATA",
              data,
            });
            await wait(getRandomNumber(4000, 6000));
          }
        };
        let nextButton;
        do {
          nextButton = document.querySelector(
            '[aria-label="View next page"]'
          ) as HTMLElement;
          await wait(10000);
          await scrapePage();
          nextButton && nextButton.click();
        } while (nextButton);
        chrome.runtime.sendMessage({
          type: "FINISH",
          data: null,
        });
      },
    });
  };

  return (
    <button style={{ width: 150 }} onClick={onclick}>
      Click to get Jobs Ids of page
    </button>
  );
}
