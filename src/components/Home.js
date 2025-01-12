import React from 'react';
import NavBar from './NavBar';
import bgimg from '../img/bg-img.jpg';
import details1 from '../img/details-img-1.jpg';
import details2 from '../img/details-img-2.jpg';
import './Home.css';

const Home = () => {
  return (
    <div>
      <NavBar/>
      <div id="glance">
        <div id="txt-home">
          <h1>
            Art is the expression of the soul. <br /> Start creating arts on Artnook.
          </h1>
          <div className="buttons">
            <a href="/create" id="create" className="cbtn">
              <i className="fa-solid fa-brush"></i>
              <p>Create</p>
            </a>
            <a href="/explore" id="explore" className="ebtn">
            <i className="fa-solid fa-images"></i>
              <p>Gallery</p>
            </a>
          </div>
        </div>
        <div>
          <img src={bgimg} id="bg-img" alt="Background" />
        </div>
      </div>
      <div id="details-1">
        <img src={details1} id="details-1-img" alt="Detail 1" />
        <div id="quote">
          <h1>Unleash Your Inner Creativity</h1>
          <p>
            In this platform, you can express your creativity and share your
            beautiful artworks in seconds.
          </p>
        </div>
      </div>
      <div id="details-2">
        <div id="quote">
          <h1>Browse, Admire & Learn from a variety of Artworks</h1>
          <p>
            With our curated gallery, you can discover new styles and genres of
            art from different artists.
          </p>
        </div>
        <img src={details2} id="details-2-img" alt="Detail 2" />
      </div>
    </div>
  );
};

export default Home;
