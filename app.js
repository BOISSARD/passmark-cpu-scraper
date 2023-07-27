const puppeteer = require('puppeteer');

async function scrape() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://www.cpubenchmark.net/CPU_mega_page.html');
    
	const privacy_modal = await page.$('div#qc-cmp2-ui');
	if (privacy_modal) {
        console.log("Privacy modal found")
        const button = await privacy_modal.$('button[mode="primary"]');
        if (button) {
            await button.click();
        }
    }
	console.log("Pas/plus de privacy modal")

	// Cliquer sur le bouton pour ouvrir le menu
	await page.waitForSelector('.columnSelectorButton[for="colSelect"]');
	await page.click('.columnSelectorButton[for="colSelect"]');
	console.log("Cliqué sur le bouton .columnSelectorButton")
	
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
	console.log("Menu column selector ouvert")

	/*
	// await page.waitForSelector('#columnSelector')
	await page.waitForFunction(() => {
		const element = document.querySelector('#columnSelector');
		console.log(element)
		return window.getComputedStyle(element).display === 'block';
	})
	console.log("le Menu #columnSelector est affiché ?")
	await page.$$eval('div.columnSelectorWrapper input[type="checkbox"]', checkboxes => {
		console.log()
		for (let checkbox of checkboxes) {
			if (checkbox.getAttribute('data-column') === 'auto') {
				checkbox.click()
				// checkbox.checked = false;
			} else {
				// Vérifier si le checkbox n'est pas désactivé
				if (!checkbox.disabled) {
					// Si non, cocher le checkbox
					checkbox.checked = true;
				} else {
					console.log(checkbox, "!! disabled !!")
				}
			}
		}
		return true;
	});

	await page.select('select[name="cputable_length"]', '-1');
	console.log("Selected All CPU")

	// Attendez que le tableau ait plus d'une ligne et que la première ligne ne contienne pas "loading..."
    await page.waitForFunction(() => {
        const rows = document.querySelectorAll('#cputable tbody tr');
        return rows.length > 1 && !rows[0].innerText.includes('oading...');
    });

    // Extrayez les données
    const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('#cputable tr'));
        return rows.map(row => row.innerText);
    });
	// const data = await page.evaluate(() => {
    //     const rows = Array.from(document.querySelectorAll('#cputable tr'));
    //     return rows.map(row => {
    //         return Array.from(row.cells).map(cell => cell.innerText.split('\n')[0]).join(",");
    //     });
    // });

    console.log(data);

    // Joindre les lignes avec des retours à la ligne pour créer le CSV
    const csv = data.join("\n");

	//*/

    // await browser.close();
}

scrape();
