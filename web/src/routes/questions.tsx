import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

// ============================================================
// TYPES
// ============================================================
interface FormData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  conditions: string[];
  diets: string[];
  allergies: string[];
  likes: string[];
  dislikes: string[];
}

interface SearchItem {
  id: number;
  name: string;
}

// ============================================================
// FONT SIZE CONTEXT (voor de Aa knop)
// ============================================================
const useFontSize = () => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseFloat(saved) : 75;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  return { fontSize, setFontSize };
};

// ============================================================
// FONT SIZE CONTROLLER (Aa knop)
// ============================================================
const FontSizeController = () => {
  const { fontSize, setFontSize } = useFontSize();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] text-3xl"
      >
        Aa
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 min-w-[180px] rounded-lg bg-white p-4 shadow-lg z-50">
          <input
            type="range"
            min="50"
            max="90"
            step="0.1"
            value={fontSize}
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
            className="w-full accent-[#1A756A]"
          />
          <div className="mt-2 text-center text-base text-gray-600">
            {Math.round(fontSize)}%
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// HEADER COMPONENT (zonder sidebar)
// ============================================================
const Header = () => {
  return (
    <header className="fixed top-0 w-full z-[1000] bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] shadow-[0_0.2rem_1rem_#000000]">
      <div className="flex items-center justify-between px-10 py-8 md:px-20">
        <Link to="/home" className="text-4xl md:text-5xl font-bold text-white transition-transform duration-300 hover:scale-105 no-underline">
          SuriHealth
        </Link>

        <nav className="flex items-center gap-6 lg:gap-8">
          <Link to="/home" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
            Home
          </Link>

          <FontSizeController />

          <Link to="/faq" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
            FAQ
          </Link>
          <Link to="/contact" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
            Contact
          </Link>
          <Link to="/login" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

// ============================================================
// FOOTER COMPONENT
// ============================================================
const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white py-10 px-10 md:px-20">
      <p className="text-xl md:text-2xl text-left">&copy; 2026 SuriHealth.</p>
    </footer>
  );
};

// ============================================================
// SEARCH INPUT COMPONENT
// ============================================================
interface SearchInputProps {
  id: string;
  placeholder: string;
  items: SearchItem[];
  selected: string[];
  onSelect: (item: string) => void;
  onRemove: (item: string) => void;
}

const SearchInput = ({ id, placeholder, items, selected, onSelect, onRemove }: SearchInputProps) => {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(item.name)
  );

  const handleSelect = (item: string) => {
    onSelect(item);
    setSearch('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
      />

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 bg-[#1A756A] text-white px-3 py-1 rounded-full text-base"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="text-white hover:text-red-400 text-xl"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search results */}
      {showResults && search && filteredItems.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.name)}
              className="w-full text-left px-4 py-2 hover:bg-[#2D9C8F] hover:text-white transition text-lg"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// QUESTIONS PAGE
// ============================================================
function QuestionsPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    conditions: [],
    diets: [],
    allergies: [],
    likes: [],
    dislikes: [],
  });

  // Mock data for search inputs
  const conditionsList: SearchItem[] = [
    { id: 1, name: 'Diabetes' },
    { id: 2, name: 'Hartziekte' },
    { id: 3, name: 'Hoge bloeddruk' },
    { id: 4, name: 'Coeliakie' },
    { id: 5, name: 'Artritis' },
  ];

  const dietsList: SearchItem[] = [
    { id: 1, name: 'Halal' },
    { id: 2, name: 'Vegetarisch' },
    { id: 3, name: 'Veganistisch' },
    { id: 4, name: 'Glutenvrij' },
    { id: 5, name: 'Lactosevrij' },
  ];

  const allergiesList: SearchItem[] = [
    { id: 1, name: "Pinda's" },
    { id: 2, name: 'Noten' },
    { id: 3, name: 'Melk' },
    { id: 4, name: 'Eieren' },
    { id: 5, name: 'Vis' },
  ];

  const ingredientsList: SearchItem[] = [
    { id: 1, name: 'Kip' },
    { id: 2, name: 'Rijst' },
    { id: 3, name: 'Groenten' },
    { id: 4, name: 'Vis' },
    { id: 5, name: 'Fruit' },
  ];

  const totalSteps = 10;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleSelectItem = (field: keyof FormData, item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), item],
    }));
  };

  const handleRemoveItem = (field: keyof FormData, item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((i) => i !== item),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    navigate({ to: '/dashboard' });
  };

  // Vraag content
  const steps = [
    {
      title: 'Wat is uw naam?',
      content: (
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Naam"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
          required
        />
      ),
    },
    {
      title: 'Wat is uw leeftijd?',
      content: (
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          placeholder="Leeftijd"
          min="0"
          max="120"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
          required
        />
      ),
    },
    {
      title: 'Wat is uw geslacht?',
      content: (
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleGenderSelect('male')}
            className={`flex-1 py-4 text-2xl font-bold rounded-lg border-4 transition ${
              formData.gender === 'male'
                ? 'border-[#1A756A] bg-[#1A756A] text-white'
                : 'border-gray-300 hover:border-[#1A756A]'
            }`}
          >
            MAN
          </button>
          <button
            type="button"
            onClick={() => handleGenderSelect('female')}
            className={`flex-1 py-4 text-2xl font-bold rounded-lg border-4 transition ${
              formData.gender === 'female'
                ? 'border-[#1A756A] bg-[#1A756A] text-white'
                : 'border-gray-300 hover:border-[#1A756A]'
            }`}
          >
            VROUW
          </button>
        </div>
      ),
    },
    {
      title: 'Wat is uw lengte?',
      content: (
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleInputChange}
          placeholder="Lengte in cm"
          min="50"
          max="250"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
          required
        />
      ),
    },
    {
      title: 'Wat is uw gewicht?',
      content: (
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          placeholder="Gewicht in kg"
          min="20"
          max="300"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
          required
        />
      ),
    },
    {
      title: 'Medische condities',
      content: (
        <SearchInput
          id="conditionsSearch"
          placeholder="Zoek medische conditie..."
          items={conditionsList}
          selected={formData.conditions}
          onSelect={(item) => handleSelectItem('conditions', item)}
          onRemove={(item) => handleRemoveItem('conditions', item)}
        />
      ),
    },
    {
      title: 'Speciaal dieet',
      content: (
        <SearchInput
          id="dietsSearch"
          placeholder="Zoek dieet..."
          items={dietsList}
          selected={formData.diets}
          onSelect={(item) => handleSelectItem('diets', item)}
          onRemove={(item) => handleRemoveItem('diets', item)}
        />
      ),
    },
    {
      title: 'Voedingsallergieën',
      content: (
        <SearchInput
          id="alergySearch"
          placeholder="Zoek allergie..."
          items={allergiesList}
          selected={formData.allergies}
          onSelect={(item) => handleSelectItem('allergies', item)}
          onRemove={(item) => handleRemoveItem('allergies', item)}
        />
      ),
    },
    {
      title: 'Ingrediënten die u graag eet',
      content: (
        <SearchInput
          id="likesSearch"
          placeholder="Zoek ingrediënten..."
          items={ingredientsList}
          selected={formData.likes}
          onSelect={(item) => handleSelectItem('likes', item)}
          onRemove={(item) => handleRemoveItem('likes', item)}
        />
      ),
    },
    {
      title: 'Ingrediënten die u liever vermijdt',
      content: (
        <SearchInput
          id="dislikesSearch"
          placeholder="Zoek ingrediënten..."
          items={ingredientsList}
          selected={formData.dislikes}
          onSelect={(item) => handleSelectItem('dislikes', item)}
          onRemove={(item) => handleRemoveItem('dislikes', item)}
        />
      ),
    },
  ];

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 pt-32">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-[0_0.2rem_1rem_#000000] p-8 md:p-12">
            {/* Progress */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-bold text-[#1A756A]">
                {currentStep + 1}/{totalSteps}
              </span>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-2 bg-black text-white rounded-lg text-xl font-bold hover:bg-[#155B52] hover:-translate-y-0.5 transition-all duration-300"
                >
                  TERUG
                </button>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-[#1A756A] text-center">VRAGEN</h2>
                <h3 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center">
                  {steps[currentStep].title}
                </h3>

                <div className="mt-6">
                  {steps[currentStep].content}
                </div>

                <div className="mt-8">
                  {currentStep === totalSteps - 1 ? (
                    <button
                      type="submit"
                      className="w-full bg-[#1A756A] text-white py-4 rounded-lg text-2xl font-bold hover:bg-[#155B52] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      PROFIEL OPSLAAN
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-[#1A756A] text-white py-4 rounded-lg text-2xl font-bold hover:bg-[#155B52] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      VOLGENDE
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// ============================================================
// ROUTER EXPORT
// ============================================================
export const Route = createFileRoute('/questions')({
  component: QuestionsPage,
});