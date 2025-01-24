import fs from "fs"

fs.readFile('./../../../public/allCards.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
  
    // Parse the file content as JSON into a JavaScript array
    const cardNames = JSON.parse(data);
  
    // Now you have the array in the `cardNames` variable
    console.log(cardNames);
  });