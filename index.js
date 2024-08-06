import e from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = e();
const port = 3000;

const BASE_URL = " https://v2.jokeapi.dev/joke"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(e.static('public'));

app.get('/', async (req, res) => {

  res.render('index.ejs', {
    prepare: true,
  });

});

app.post('/', async (req, res) => {
  try {
    const category = req.body.category;
    const response = await axios.get(`${BASE_URL}/${category}`);
    const jokeData = response.data;

    let joke = ''
    let imgJoke = '';

    if (req.body.category === 'any') {
      const randomNum = Math.floor(Math.random() * 4) + 1
      imgJoke = 'any-' + randomNum
    } else {
      imgJoke = category;
    }

    if (jokeData.setup) {
      joke = `${jokeData.setup}<br/><strong>${jokeData.delivery}</strong>`
    } else if (jokeData.joke) {
      joke = jokeData.joke
    }

    res.render('index.ejs', {
      theJoke: joke,
      img: imgJoke
    });
  } catch (error) {
    res.send(JSON.stringify(error.response.data));
  }
})

app.listen(port, () => {
  console.log(`Server running  on port ${port}`);
});