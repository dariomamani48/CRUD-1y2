const fs = require('fs'); // requerimos filesync para poder modificar la database
const path = require('path'); //requerimos el path para redireccionar correctamente la ruta de la base de datos

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');// traemos la base de datos donde se trabajara el crud
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8')); // usamos la configuracion para parsear el json y cremos la variable de productos con la info de la db parseada
const writeJSON = (dataBase) => {
	fs.writeFileSync(path.join(__dirname,"../data/productsDataBase.JSON"), JSON.stringify(dataBase), 'utf-8')
}//creamos una funciona para reescibir o modificar la db .- usa una funcon con un callback para escribir el json asi se muestra en las vistas

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // esto venia con el tp- es una funciona extraña que se usa para agregar el punto del mil luego del tercer cero 

const controller = {// aqui tenemos los controladores que usara products
	// Root - Show all products
	index: (req, res) => {   // aqui usamos un res render para enviarle al navegador como respuesta la vista products, y la base de datos que metimos en la variable products para trabajar en ella y ademas la funcion que agrega el punto del mil
		res.render('products',{
			products,
			toThousand
		})
	},

	// Detail - Detail from one product- Este controlador lo que hace es mostrar la vista el producto que se selecciona tomando el id que se recibe por parametro en el request
	detail: (req, res) => {
		let product = products.find(product => product.id === +req.params.id);// aqui encuentra el producto igualando con el metodo find la id del producto con el parametro ingresado desde el req y se agrega adelante el signo mas (+) para indicar que este id es un numero

		res.render('detail', {// cuando encontro el id del producto lo envviamos por render a la vista detail mas la variable que contiene la db mas la fucnion del punto del mil
			product,//esta el la varible que contiene la db
			toThousand// esta es la fucnion que agrega el punto a los precios 
		})

	},

	// Create - Form to create- este controlador solamente renderiza la vista para crear un producto. una ruta hecha por metodo get
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store- Aqui ya es un descontrol de cosas maldito backend- vamos por parte como dijo jack  
	store: (req, res) => {
		let lastId = 1; // creamos una variable que nos va a a servir mas adelante con valor uno

		products.forEach(product => { //aqui iteramos los productos de la db, para que si su id es mayor a uno la variable anterior asigne el valor al id
			if(product.id > lastId){ //esta es la condicion 
				lastId = product.id// 
			}
		})
		let {name,
			price,
			discount,
			category,
			description} = req.body;// aui destructuramos los datos que trae el formulario por req del body

		let newProduct = {//el nuevo producto toma como id el ultimo id que iteramos y le agrega uno
			id: lastId + 1,
			name,
			price,
			discount,
			category,
			description,
			image: "default-image.png"// agregamos los datos del producto nuevo
		};
		
		products.push(newProduct);// metemos el producto nuevo a la db con el metodo push

		writeJSON(products);//reescribimos la base de datos con el nuevo producto agregado
		
		res.redirect('/products')// ahora por ultimo una vex que el prod fue agregado redireccionamos a la vista de productos
	},

	// Update - Form to edit- este es elcontrolador del get que trae a la vista la info de un producto a modificar
	edit: (req, res) => {
		let product = products.find(product => product.id === +req.params.id); //busca con find el producto iterando para igualarlos al que fue pedido por params

		res.render('product-edit-form', {
			product,
			
		})//renderiza la vista de ese producto + la db que esta dentro de la variable
	},
	// Update - Method to update
	update: (req, res) => {// para actualizar un producto generamos un destructurado del req body para tener los datos a modificar que vienen en el formulario
		let {name,
			price,
			discount,
			category,
			description} = req.body;
			
		products.forEach(product => {//aqui usamor un for para iterar los elementos y luego en la condicion lo igualamos con la soliditud del rq
			if(product.id === +req.params.id){
				product.name = name,//al tener los datos listos para modificar le asignamos los valores nuevos
				product.price = price,//
				product.discount = discount,
				product.category = category,
				product.description = description
			}
				
		});
		writeJSON(products);//nuevamente reescribiimos el json con los datos que tomo ahora product que recibe por el reqbody

		res.redirect('/products')//redireccionamos a la vista products.- deberia salir el nuevo producto al final de la lista con los nuevos datos
		
		
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products.forEach(product =>{// creamos un for each para iterar la variable 
			if(product.id === +req.params.id){// la condicion es si lo qe pasamos por paramotr es igual a alun id de products
				let productoAEliminar = products.indexOf(product); //creamos una variable para meter el index de un producto a eliminar de la db
				products.splice(productoAEliminar,1)//en la variable usmos el metodo splice como parametros  va primero la variable creada con el index, y como segundo parametro la cantidad de productos a eliminar
			}
		})
		writeJSON(products)//reescribimos el json con los nuevos datos
		res.redirect('/products')//redirijimos a la vista de productos- deberia salir la lista de productos con un producto menos
	}
};

module.exports = controller;//exportamos todo el controlador