const express = require('express');
const path = require('path');
const xlsx = require('xlsx');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Load and parse Excel data
const workbook = xlsx.readFile('store_data.xlsx'); // Make sure the path to your Excel file is correct
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const stores = xlsx.utils.sheet_to_json(worksheet);

// Endpoint to handle POST requests for finding stores
app.post('/find-stores', (req, res) => {
    const { zipCode, category } = req.body;
    console.log('Request received: ', { zipCode, category });

    // Filter stores by zipCode and category
    const filteredStores = stores.filter(store => {
        return (
            store.Zip_Code && store.Zip_Code.toString() === zipCode &&
            store.Category && store.Category.toLowerCase() === category.toLowerCase()
        );
    });

    console.log('Filtered Stores: ', filteredStores);

    // If there are more than 10 stores, randomly pick 10
    const randomStores = filteredStores.sort(() => 0.5 - Math.random()).slice(0, 10);

    console.log('Random Stores: ', randomStores);

    // Send the selected stores' data to the frontend
    const response = randomStores.map(store => ({
        Address: store.Address,
        State: store.State,
        Zip_Code: store.Zip_Code
    }));

    res.json(response);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
