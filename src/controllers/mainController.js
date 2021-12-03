const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {// creamos variables con los datos de la db que nos dieron parseada.- el ejercicio solicita que se vean los produtos visitados y los en oferta o insale- 
		let productsInSale = products.filter(product => product.category === "in-sale");
		let productsVisited =products.filter(product => product.category === "visited");

		res.render('index', {//aqui renderizamos esatas vistas y le pasamos los datos de las variables que creamos
			productsInSale, 
			productsVisited,
			toThousand
		});
	},
	search: (req, res) => {
		let result = [];
		products.forEach(product => {
			product.name.toLowerCase().includes(req.query.keywords.toLowerCase())? result.push(product) : "";			
		});
		res.render('results', {
			result,
			toThousand,
			search: req.query.keywords
		});
	},

};

module.exports = controller;
