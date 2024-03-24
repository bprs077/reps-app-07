import puppeteer from 'puppeteer';
import fs from 'fs';

function generateUniqueTimestamp() {
  // Get the current date and time
  var currentDate = new Date();
  
  // Create a unique timestamp string using various date and time components
  var uniqueTimestamp = currentDate.getFullYear() +
                        padZero(currentDate.getMonth() + 1) +
                        padZero(currentDate.getDate()) +
                        padZero(currentDate.getHours()) +
                        padZero(currentDate.getMinutes()) +
                        padZero(currentDate.getSeconds()) +
                        currentDate.getMilliseconds();
  
  return uniqueTimestamp;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(num) {
  return (num < 10 ? '0' : '') + num;
}

    // Sleep function for more realistic scraping
    function sleep(min, max) {
      const ms = Math.floor(Math.random() * (max - min + 1)) + min;
      return new Promise(resolve => setTimeout(resolve, ms));
    }

async function scrapeFaxInfo() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //await page.goto('https://faxzero.com/fax_senate.php'); // Senate
    //await page.goto('https://faxzero.com/fax_congress.php'); // House of Representatives
    await page.goto('https://faxzero.com/fax_governor.php'); // Governors

    // Find all links that match the specified pattern
    const links = await page.$$eval('a[href^="https://faxzero.com/fax_"]', links => 
      links.map(link => link.href)
      .filter(href => 
          !href.includes("fax_congress.php") && 
          !href.includes("fax_senate.php") && 
          !href.includes("fax_governor.php")
      )
    );    

    const results = [];

    for (let index = 0; index < links.length; index++) {
        const link = links[index];
        await page.goto(link);
        await sleep(2000, 5000); // Random delay

        // Get values and remove "Honorable " from the name if present
        const faxValue = await page.$eval('#input-fax_r_fax', el => el.value).catch(() => 'N/A');
        let nameValue = await page.$eval('#input-fax_r_name', el => el.value).catch(() => 'N/A');
        nameValue = nameValue.replace("Honorable ", "");

        // Log the progress
        console.log(`Processed item ${index + 1} of ${links.length} for ${nameValue} (${faxValue}) from ${link}...`);

        results.push({ link, faxValue, nameValue });
    }

    await browser.close();

    return results;
}

// Function to save data to CSV
function saveToCSV(data, filename) {
    const header = 'Link,Fax Number,Name\n';
    const rows = data.map(obj => `${obj.link},${obj.faxValue},"${obj.nameValue}"`).join('\n');
    const csvData = header + rows;

    fs.writeFileSync(filename, csvData, (err) => {
        if (err) throw err;
        console.log(`Data saved to ${filename}`);
    });
}

// Execute and save
//var timestamp = generateUniqueTimestamp();
//var filenameTs = `rep_faxes_${timestamp}.csv`;
//scrapeFaxInfo().then(results => saveToCSV(results, filenameTs));
scrapeFaxInfo().then(results => saveToCSV(results, 'gov_faxes.csv'));