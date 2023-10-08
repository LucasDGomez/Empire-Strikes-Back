import {useEffect, useState} from 'react';
import './App.scss';
import Species from './Species';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

function App() {
  const [specieList, setSpecieList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSpecieList = async () => {
    const apiResponse = await fetch(API_URL);
    const data = await apiResponse.json();
    const speciesApiUrls = data.species;
    const specieListData = await speciesApiUrls.reduce(
      async (accumulator, api_url) => {
        const response = await fetch(api_url);
        const data = await response.json();
        const specieData = {
          name: data.name,
          classification: data.classification,
          designation: data.designation,
          height: isNaN(data.average_height)
            ? data.average_height
            : (data.average_height / CM_TO_IN_CONVERSION_RATIO).toFixed() +
              "''",
          image: getSpecieImage(data.name, SPECIES_IMAGES),
          numFilms: data.films.length,
          language: data.language,
        };

        accumulator = [...(await accumulator), specieData];
        return accumulator;
      },
      []
    );

    return specieListData;
  };

  const getSpecieImage = (specieName, imageList) => {
    const specieKeys = Object.keys(imageList);
    const specieKey = specieKeys.filter(key =>
      specieName.toLowerCase().includes(key)
    );
    return imageList[specieKey];
  };

  useEffect(() => {
    getSpecieList()
      .then(result => {
        setSpecieList(result);
        setLoading(false);
      })
      .catch(() => {
        alert('Error getting data');
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {!loading ? (
          specieList.map((data, index) => {
            return <Species key={index} {...data} />;
          })
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </div>
  );
}

export default App;
