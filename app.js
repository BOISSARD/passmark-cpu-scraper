const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrape() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://www.cpubenchmark.net/CPU_mega_page.html');
    
	await page.waitForSelector('div#qc-cmp2-ui');
	const privacy_modal = await page.$('div#qc-cmp2-ui');
	if (privacy_modal) {
        console.log("Privacy modal found")
        const button = await privacy_modal.$('button[mode="primary"]');
        if (button) {
            await button.click();
        }
    }
	console.log("No privacy modal")

	// Cliquer sur le bouton pour ouvrir le menu
	await page.waitForSelector('.columnSelectorButton[for="colSelect"]');
	await page.click('.columnSelectorButton[for="colSelect"]');
	console.log("Clicked on .columnSelectorButton")
	
	// Attendre que le menu apparaisse
	const menuColumnSelector = await page.$("#columnSelector")
	if (menuColumnSelector) {
        console.log("menuColumnSelector found", menuColumnSelector)
		// const displayProperty = await page.evaluate((element) => {
		// 	return window.getComputedStyle(element).display;
		// }, menuColumnSelector);
		// console.log(displayProperty)
		await page.waitForFunction(
			(element) => window.getComputedStyle(element).display === 'block',
			{}, // Options pour waitForFunction (facultatif)
			menuColumnSelector // Arguments pour la fonction
		);
	}
	console.log("Menu column selector opened")

	const checkboxes = await menuColumnSelector.$$('input[type="checkbox"]')
	for (const checkbox of checkboxes) {
		const [name, checked] = await page.evaluate((checkbox) => [checkbox.getAttribute('data-column'), checkbox.checked], checkbox)
        // console.log(name, checked)
		if ((name === 'auto' && checked) || !checked) {
            await checkbox.click();
        }
	}
	await page.click('.columnSelectorButton[for="colSelect"]');
	console.log("All column selected and menu closed")

	await page.select('select[name="cputable_length"]', '-1');
	console.log("Selected All CPU")
	
	let rowCount;
    let previousRowCount;
    do {
        previousRowCount = rowCount;
        await page.waitForTimeout(1000); // attend 1 seconde
        const rows = await page.$$('#cputable tbody tr');
        rowCount = rows.length;
    } while (rowCount !== previousRowCount);
    console.log(`The table has ${rowCount} rows.`);

	const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('#cputable tr'));
        return rows.map((row, i) => {
            // return Array.from(row.cells).map(cell => cell.innerText)
            return Array.from(row.cells).map(cell => cell.innerText.split('\n')[0]).join(",");
        });
    });
    console.log(data.slice(0,2))

    // Joindre les lignes avec des retours à la ligne pour créer le CSV
    const csv = data.join("\n");
	
	fs.writeFile(`cpu_benchmarks_${new Date().toISOString().replace(/:/g, '-')}.csv`, csv, (err) => {
		if (err) {
			console.error('Une erreur s\'est produite lors de l\'écriture du fichier !', err);
		} else {
			console.log('Le fichier a été écrit avec succès !');
		}
	});

    await browser.close();
}

scrape();
