import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useToast } from '#/hooks/use-toast';
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Activity,
  Heart,
  Ban,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

export const Route = (createFileRoute as any)('/profile-setup')({
  component: ProfileSetupPage,
});

function ProfileSetupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [answers, setAnswers] = useState({
    name: '',
    age: 25,
    gender: 'Vrouw',
    height: 170,
    weight: 70,
    conditions: [] as string[],
    diets: [] as string[],
    allergies: [] as string[],
    likes: [] as string[],
    dislikes: [] as string[],
  });

  const conditionOptions = [
    'Geen',
    'Diabeet (Suikerziekte)',
    'Hoge Bloeddruk',
    'Cholesterol',
    'Hart- en vaatziekten',
  ];
  const dietOptions = [
    'Geen speciaal dieet',
    'Vegetarisch',
    'Veganistisch',
    'Gluten vrij',
    'Lactose vrij',
    'Zoutarm',
  ];
  const allergyOptions = [
    'Geen',
    "Pinda's / Noten",
    'Schelpdieren (Garnalen/Krab)',
    'Zuivel',
    'Eieren',
    'Soja',
    'Tarwe',
  ];
  const ingredientOptions = [
    'Kip',
    'Rundvlees',
    'Vis (Bakkeljauw)',
    'Garnalen',
    'Kouseband',
    'Pompoen',
    'Antruwa',
    'Sopropo',
    'Banaan/Plantaan',
    'Cassave',
    'Rijst',
    'Roti',
  ];

  const handleCheckboxToggle = (
    field: 'conditions' | 'diets' | 'allergies' | 'likes' | 'dislikes',
    option: string,
  ) => {
    setAnswers((prev) => {
      const currentList = prev[field];
      if ((field === 'conditions' || field === 'allergies') && option === 'Geen') {
        return { ...prev, [field]: [option] };
      }
      if (field === 'diets' && option === 'Geen speciaal dieet') {
        return { ...prev, [field]: [option] };
      }

      let filtered = currentList.filter(
        (item) => item !== 'Geen' && item !== 'Geen speciaal dieet',
      );

      if (filtered.includes(option)) {
        filtered = filtered.filter((item) => item !== option);
      } else {
        filtered = [...filtered, option];
      }

      return { ...prev, [field]: filtered };
    });
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    if (currentStep === 1 && !answers.name.trim()) {
      setError('Vul alstublieft uw naam in.');
      return;
    }

    if (currentStep < 10) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError('');

    try {
      const formPayload = new FormData();
      formPayload.append('age', answers.age.toString());
      formPayload.append('gender', answers.gender);
      formPayload.append('height', answers.height.toString());
      formPayload.append('weight', answers.weight.toString());

      answers.conditions.forEach((c) => formPayload.append('conditions', c));
      answers.diets.forEach((d) => formPayload.append('diets', d));
      answers.allergies.forEach((a) => formPayload.append('allergies', a));
      answers.likes.forEach((l) => formPayload.append('likes', l));
      answers.dislikes.forEach((d) => formPayload.append('dislikes', d));

      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || 'Fout bij opslaan.');
      }

      toast({
        title: 'Profiel geconfigureerd!',
        description: 'Welkom bij SuriHealth. Uw maaltijden staan klaar.',
        type: 'success',
      });

      navigate({ to: '/dashboard' });
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het opslaan van uw profiel.');
      setLoading(false);
    }
  };

  const progressPercent = (currentStep / 10) * 100;

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 relative overflow-hidden mx-auto mt-24">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full bg-gray-100 h-2">
        <div
          className="bg-[#1A756A] h-2 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <span className="text-xs font-bold text-[#1A756A] bg-teal-50 px-3 py-1 rounded-full">
          Vraag {currentStep} van 10
        </span>
        <span className="text-xs font-medium text-gray-400">
          {Math.round(progressPercent)}% Voltooid
        </span>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100 text-xs">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6 min-h-[260px] flex flex-col justify-between">
        <div>
          {/* Step 1: Name */}
          {currentStep === 1 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <User className="text-[#1A756A] h-6 w-6" /> 1. Wat is uw naam?
              </h2>
              <p className="text-gray-500 text-sm">
                Hiermee kunnen we uw dashboard persoonlijk maken.
              </p>
              <input
                type="text"
                autoFocus
                required
                placeholder="Uw volledige naam"
                value={answers.name}
                onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A756A] focus:outline-none text-sm text-gray-900 transition-all"
              />
            </div>
          )}

          {/* Step 2: Age */}
          {currentStep === 2 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800">2. Wat is uw leeftijd?</h2>
              <p className="text-gray-500 text-sm">
                Belangrijk voor het berekenen van uw dagelijkse energiebehoefte.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={answers.age}
                  onChange={(e) =>
                    setAnswers({ ...answers, age: parseInt(e.target.value) || 0 })
                  }
                  className="w-24 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-center text-sm font-bold text-gray-900 focus:outline-none"
                />
                <span className="text-gray-600 text-sm font-medium">jaar oud</span>
              </div>
            </div>
          )}

          {/* Step 3: Gender */}
          {currentStep === 3 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800">3. Wat is uw geslacht?</h2>
              <div className="grid grid-cols-3 gap-3">
                {['Man', 'Vrouw', 'Anders'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setAnswers({ ...answers, gender: g })}
                    className={`py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      answers.gender === g
                        ? 'border-[#1A756A] bg-teal-50 text-[#1A756A] shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Height */}
          {currentStep === 4 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800">4. Wat is uw lengte?</h2>
              <p className="text-gray-500 text-sm">
                Gebruikt voor de BMI-bepaling op het dashboard.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={answers.height}
                  onChange={(e) =>
                    setAnswers({ ...answers, height: parseInt(e.target.value) || 0 })
                  }
                  className="w-24 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-center text-sm font-bold text-gray-900 focus:outline-none"
                />
                <span className="text-gray-600 text-sm font-medium">centimeter (cm)</span>
              </div>
            </div>
          )}

          {/* Step 5: Weight */}
          {currentStep === 5 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800">5. Wat is uw gewicht?</h2>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={answers.weight}
                  onChange={(e) =>
                    setAnswers({ ...answers, weight: parseInt(e.target.value) || 0 })
                  }
                  className="w-24 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-center text-sm font-bold text-gray-900 focus:outline-none"
                />
                <span className="text-gray-600 text-sm font-medium">kilogram (kg)</span>
              </div>
            </div>
          )}

          {/* Step 6: Medical Conditions */}
          {currentStep === 6 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Activity className="text-[#1A756A] h-6 w-6" /> 6. Medische condities
              </h2>
              <p className="text-gray-500 text-sm">
                Suikerrijke maatregelen worden automatisch aangepast voor diabetici.
              </p>
              <div className="flex flex-wrap gap-2">
                {conditionOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleCheckboxToggle('conditions', option)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      answers.conditions.includes(option)
                        ? 'bg-amber-50 border-amber-500 text-amber-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Special Diet */}
          {currentStep === 7 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Heart className="text-[#1A756A] h-6 w-6" /> 7. Heeft u een speciaal dieet?
              </h2>
              <div className="flex flex-wrap gap-2">
                {dietOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleCheckboxToggle('diets', option)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      answers.diets.includes(option)
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Allergies */}
          {currentStep === 8 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Ban className="text-[#1A756A] h-6 w-6" /> 8. Voedingsallergieën
              </h2>
              <p className="text-gray-500 text-sm">
                Ingrediënten die u selecteert worden strikt uitgesloten van uw menu.
              </p>
              <div className="flex flex-wrap gap-2">
                {allergyOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleCheckboxToggle('allergies', option)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      answers.allergies.includes(option)
                        ? 'bg-red-50 border-red-400 text-red-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 9: Likes */}
          {currentStep === 9 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <ThumbsUp className="text-[#1A756A] h-6 w-6" /> 9. Wat eet u graag?
              </h2>
              <p className="text-gray-500 text-sm">
                Kies uw favoriete Surinaamse basisingrediënten.
              </p>
              <div className="flex flex-wrap gap-2">
                {ingredientOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleCheckboxToggle('likes', option)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      answers.likes.includes(option)
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 10: Dislikes */}
          {currentStep === 10 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <ThumbsDown className="text-[#1A756A] h-6 w-6" /> 10. Wat vermijdt u liever?
              </h2>
              <p className="text-gray-500 text-sm">
                Elementen die u absoluut niet in uw planning wilt terugzien.
              </p>
              <div className="flex flex-wrap gap-2">
                {ingredientOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={answers.likes.includes(option)}
                    onClick={() => handleCheckboxToggle('dislikes', option)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-20 ${
                      answers.dislikes.includes(option)
                        ? 'bg-red-50 border-red-400 text-red-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed font-bold text-sm transition-all cursor-pointer focus:outline-none"
          >
            <ChevronLeft className="h-4 w-4" />
            Vorige
          </button>

          {currentStep < 10 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1 bg-[#1A756A] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#145f54] transition-all cursor-pointer shadow-sm"
            >
              Volgende
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-[#1A756A] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#145f54] disabled:opacity-60 transition-all cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Afronden
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}