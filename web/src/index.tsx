import { Link } from 'react-router-dom';

const Index = () => {
  const features = [
    {
      icon: '🍛',
      title: 'Surinaamse Recepten',
      description: 'Ontdek heerlijke en gezonde Surinaamse gerechten.'
    },
    {
      icon: '📊',
      title: 'Maaltijdplanning',
      description: 'Plan je maaltijden eenvoudig voor de hele week.'
    },
    {
      icon: '💪',
      title: 'Gezondheidsdoelen',
      description: 'Volg je voedingsdoelen en blijf gemotiveerd.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-b from-suri-cream to-white rounded-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Welkom bij <span className="text-suri-green">SuriHealth</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Jouw persoonlijke meal planner voor een gezonde Surinaamse levensstijl
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn-primary text-lg">
            Start vandaag
          </Link>
          <Link to="/contact" className="bg-white text-suri-green px-8 py-3 rounded-lg border-2 border-suri-green hover:bg-suri-green hover:text-white transition-all duration-200 font-semibold">
            Contact
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Waarom SuriHealth?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;