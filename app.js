const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const fortunes = require('./data/fortune');

const app = express();

app.use(bodyParser.json());

app.get('/fortunes', (req, res) => {
	res.json(fortunes);

});

app.get('/fortunes/random', (req, res) => {
	res.json(fortunes[Math.floor(Math.random() * fortunes.length)]);
});

app.get('/fortunes/:id', (req, res) => {
	res.json(fortunes.find(f => f.id == req.params.id));
})

const writeFortune = (json) => {
	fs.writeFile('./data/fortune.json', JSON.stringify(json), err => console.log(err));
};

app.post('/fortunes', (req, res) => {
	const {message, lucky_number, spirit_animal} = req.body;
	const fortunes_ids = fortunes.map(f => f.id);

	const fortune = {
		id: (fortunes_ids.length > 0 ?  Math.max(...fortunes_ids) : 0) + 1,
		message,
		lucky_number,
		spirit_animal
	};
	const new_fortunes = fortunes.concat(fortune);
	writeFortune(new_fortunes);
	res.json(new_fortunes);
});

app.put('/fortunes/:id', (req, res) => {
	const {id} = req.params;

	const old_fortune = fortunes.find(f => f.id == id);

	
	['message', 'lucky_number', 'spirit_animal'].forEach(key => {
		if(req.body[key]) old_fortune[key] = req.body[key];
	});

	writeFortune(fortunes);
	res.json(fortunes);
	});


app.delete('/fortunes/:id', (req, res) => {
	const {id} = req.params;

	const new_fortunes = fortunes.filter(f => f.id != id);
	writeFortune(new_fortunes);
	res.json(new_fortunes);
});

module.exports = app;