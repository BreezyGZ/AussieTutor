export {}
function isError(error:unknown): error is Error {
    return typeof error === "object" && error !== null && "message" in error;
}

async function getData(url:string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        console.log(response)
        const json = await response.json();
        console.log(json);
    
} catch (error) {
    console.log("error")

    if (isError(error)) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
  }
}

// getData("https://www.mtgmate.com.au/cards/search?q=faithless%20looting")
