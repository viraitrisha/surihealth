import { Link } from "@tanstack/react-router";

export default function WelcomeCard() {
    return (
        <section className="welcome-card">
            <h2>Welkom, gebruiker</h2>
            <p>Wilt u automatisch dagelijkse recepten ontvangen of handmatig instellen?</p>

            <div className="button">
              <Link to= "/automatisch" className='btn'>
              automatisch
              </Link>

              <Link to= "/handmatig" className="btn">
              handmatig
              </Link>
            </div>
        </section>
    )
}