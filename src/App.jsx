import React, { useState, useEffect } from 'react';
import Footer from './components/Footer';
import Main from './components/Main';
import Sidebar from './components/Sidebar';

function App() {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;
      const url = 'https://api.nasa.gov/planetary/apod' + `?api_key=${NASA_API_KEY}`;
      
      const today = (new Date()).toDateString();
      const localKey = `NASA-${today}`;
      if (localStorage.getItem(localKey)) {
        const apiData = JSON.parse(localStorage.getItem(localKey));
        setData(apiData);
        console.log('Fetched from cache today');
        return;
      }
      localStorage.clear();

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const apiData = await res.json();
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        console.log('Fetched from API today');
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchAPIData();
  }, []);

  return (
    <>
      {data ? (<Main data={data} />) : (
        <div className='loadingState'>
          <i className="fa-solid fa-gear"></i>
        </div>
      )}
      {showModal && (
        <Sidebar data={data} handleToggleModal={handleToggleModal} />
      )}
      {data && (
        <Footer data={data} handleToggleModal={handleToggleModal} />
      )}
    </>
  );
}

export default App;
