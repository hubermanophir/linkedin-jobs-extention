// import { useState } from "react";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0);
  const onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        // document.querySelector('[data-job-id="4161952581"]').click()


        //data-job-id="4161952581"
        // alert(card?.textContent);
        // window.scrollTo(0, document.body.scrollHeight);

        // document.querySelectorAll(".scaffold-layout__list-item")   Thats each item of the page
        //document.querySelector('[aria-label="View next page"]') // the next button This disappears in the last page

        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      },
    });
  };
  return (
    <>
      <div>
        <button onClick={onclick}>Click me</button>
        Test the selectors if not broken:
        <div>
          {`for jobs: document.querySelectorAll(".scaffold-layout__list-item")`}
        </div>
        <div>
          {`for next button: document.querySelector('[aria-label="View next page"]')`}
        </div>
      </div>
    </>
  );
}

export default App;
