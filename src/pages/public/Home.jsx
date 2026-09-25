import { Link } from "react-router-dom";
import Button from "../../components/Button";
import farmHero from "../../assets/farm-hero.jpg";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero" aria-label="Introduction">
        <div className="home-hero__media" aria-hidden="true">
          <img src={farmHero} alt="" className="home-hero__img" />
          <div className="home-hero__veil" />
        </div>

        <div className="home-hero__content">
          <p className="home-hero__brand">FreshFarm</p>
          <h1 className="home-hero__headline">
            Fresh milk, farm to door
          </h1>
          <p className="home-hero__lede">
            Local dairy delivered on your schedule — cold, clean, and traced to
            the farm that filled the bottle.
          </p>
          <div className="home-hero__actions">
            <Button as={Link} to="/products" variant="primary">
              Order milk
            </Button>
            <Button as={Link} to="/seller/login" variant="ghost">
              Sell with FreshFarm
            </Button>
          </div>
        </div>
      </section>

      <section className="home-flow" aria-labelledby="flow-heading">
        <div className="home-flow__inner">
          <h2 id="flow-heading">How FreshFarm works</h2>
          <p className="home-flow__intro">
            Three steps from pasture to your porch.
          </p>
          <ol className="home-flow__steps">
            <li>
              <span className="home-flow__num">01</span>
              <h3>Choose your milk</h3>
              <p>Whole, low-fat, or dairy alternatives from nearby producers.</p>
            </li>
            <li>
              <span className="home-flow__num">02</span>
              <h3>Set your schedule</h3>
              <p>One-time drop or a weekly subscription that fits your kitchen.</p>
            </li>
            <li>
              <span className="home-flow__num">03</span>
              <h3>Receive chilled</h3>
              <p>Bottles arrive cold, labeled with farm origin and fill date.</p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
