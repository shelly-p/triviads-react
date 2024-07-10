const About = () => {
  return (
    <div>
      <div class="about-section">
        <h1>About Us Page</h1>
        <p>Some information about who we are and what we do.</p>
      </div>
      <h2 className="text-height text-light p-5 text-center">Our Team</h2>
      <div>
        {" "}
        <div className="about-height">
          <div class="container text-center">
            <div class="row">
              <div class="column">
                <div class="card">
                  <div class="container">
                    <h2>Daniel Vallejo</h2>
                    <p class="title">Front-End Developer</p>
                    <p>People say nothing is impossible, but i do nothing everyday.</p>
                    <p>daniel@example.com</p>
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="card">
                  <div className="container">
                    <h2>Anissa Braca</h2>
                    <p class="title">Back-End Developer</p>
                    <p>Likes to sleep.</p>
                    <p>Anissa@example.com</p>
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="card">
                  <div className="container">
                    <h2>Sheldon Lewis</h2>
                    <p class="title">Data Base Engineer</p>
                    <p>Really likes potatoes!</p>
                    <p>Sheldon@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;