const Home = () => {
  return (
    <div className="section_home_hero text-light">
      <div className="px-4 pt-5 my-5  text-center border-bottom ">
        <h1 className=" display-4  fw-bold text-light">
          TriviADS where the fun begins!!
        </h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            TriviADS is the number 1 website in the world leading in trivia
            games. We bring a series of categories that each player can choose
            from and compete with many other players by choosing to play
            multiplayer or they can also choose to play solo. We make sure to
            promote a safe environment where players get to be competitive as
            possible. Don't believe us? Try it yourself by creating an account
            right now!
          </p>
        </div>
        <div className="section_home-features">
          <div className="container px-4 py-5" id="featured-3">
            <h2 className="pb-2 border-bottom">
              The features that TriviADS brings are:
            </h2>
            <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
              <div className="feature col">
                <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3"></div>
                <h3 className="fs-2">Multiplayer</h3>
                <p>
                  With our multiplayer feature we make sure all the player can
                  have a better experience by becoming competitive against each
                  other and trying to get to the first place.
                </p>
              </div>
              <div className="feature col">
                <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3"></div>
                <h3 className="fs-2">Solo Player</h3>
                <p>
                  With the solo player feature we make it a more safe
                  environment since the player can take its time to learn from
                  the questions, but it can also compete against itself by
                  beating its record of correct answers.
                </p>
              </div>
              <div className="feature col te">
                <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3"></div>
                <h3 className="fs-2">Timer</h3>
                <p>
                  The last feature TriviADS brings are timed questions with a
                  timer making the experience more intense.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;