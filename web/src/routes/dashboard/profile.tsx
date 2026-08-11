import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { submitProfileSetup, getProfile } from '../../server-functions/profile';
import { getUserSession } from '../../server-functions/auth';
import { useToast } from '#/hooks/use-toast';
import {
  Loader2,
  Save,
  Ruler,
  Scale,
  LayoutDashboard,
  Upload,
  Flame,
} from 'lucide-react';

export const Route = (createFileRoute as any)('/dashboard/profile')({
  loader: async () => {
    const sessionData = await getUserSession();
    if (!sessionData) throw new Error('Niet geautoriseerd');

    const profileData = await getProfile();

    return { sessionData, profileData };
  },
  component: DashboardProfilePage,
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

const tabs = ['basis', 'medisch', 'voorkeuren'] as const;

function DashboardProfilePage() {
  const { sessionData, profileData } = Route.useLoaderData() as any;
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('basis');

  // Helper om database-waarden (bijv. 'Diabetic') te vertalen naar wat de gebruiker ziet
  const mapDatabaseToFrontend = (list: string[] | null | undefined): string[] => {
    if (!list || !Array.isArray(list)) return [];
    return list.map((item: string) =>
      item === 'Diabetic' || item === 'diabetic' ? 'Diabeet (Suikerziekte)' : item
    );
  };

  // Helper om de frontend-labels terug te vertalen naar database-waarden
  const mapFrontendToDatabase = (list: string[]): string[] =>
    list.map((item: string) =>
      item === 'Diabeet (Suikerziekte)' ? 'Diabetic' : item
    );

  // Bouw de initiële formulierdata uit de loader-resultaten
  const getInitialFormData = () => ({
    name: sessionData?.user?.name || 'Gebruiker',
    imageUrl: sessionData?.user?.image || '',
    age: profileData?.age ?? 25,
    gender: profileData?.gender || 'Vrouw',
    height: profileData?.height ?? 170,
    weight: profileData?.weight ?? 70,
    conditions: mapDatabaseToFrontend(profileData?.conditions),
    diets: profileData?.diets ?? [],
    allergies: profileData?.allergies ?? [],
    likes: profileData?.likes ?? [],
    dislikes: profileData?.dislikes ?? [],
  });

  const [formData, setFormData] = useState(getInitialFormData);

  // Synchroniseer de formulierdata opnieuw als de loaderdata verandert (bv. na reload)
  // Dit zorgt ervoor dat de allereerste render altijd de juiste waarden toont.
  useState(() => {
    setFormData(getInitialFormData());
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Afbeelding te groot',
          description: 'Kies een bestand van maximaal 2MB.',
          type: 'error',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          const updated = { ...prev, imageUrl: reader.result as string };
          if (typeof window !== 'undefined') {
            localStorage.setItem('surihealth_profile_cache', JSON.stringify(updated));
          }
          return updated;
        });
        toast({
          title: 'Foto ingeladen',
          description: 'Klik onderaan op opslaan om de wijziging te bewaren.',
          type: 'success',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxToggle = (
    field: 'conditions' | 'diets' | 'allergies' | 'likes' | 'dislikes',
    option: string,
  ) => {
    setFormData((prev) => {
      const currentList = prev[field];
      let newList: string[] = [];

      if (option === 'Geen' || option === 'Geen speciaal dieet') {
        newList = [option];
      } else {
        const filteredList = currentList.filter(
          (item: string) => item !== 'Geen' && item !== 'Geen speciaal dieet',
        );
        if (filteredList.includes(option)) {
          newList = filteredList.filter((item: string) => item !== option);
        } else {
          newList = [...filteredList, option];
        }
      }

      const updated = { ...prev, [field]: newList };
      if (typeof window !== 'undefined') {
        localStorage.setItem('surihealth_profile_cache', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim().length < 2) {
      toast({
        title: 'Naam te kort',
        description: 'Vul een geldige naam in van minimaal 2 letters.',
        type: 'warning',
      });
      return;
    }
    setLoading(true);
    try {
      const result = await submitProfileSetup({
        data: {
          name: formData.name.trim(),
          imageUrl: formData.imageUrl.trim(),
          age: Number(formData.age),
          gender: formData.gender,
          height: Number(formData.height),
          weight: Number(formData.weight),
          conditions: mapFrontendToDatabase(formData.conditions),
          diets: formData.diets,
          allergies: formData.allergies,
          likes: formData.likes,
          dislikes: formData.dislikes,
        },
      });

      if (result.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('surihealth_profile_cache', JSON.stringify(formData));
          toast({ title: 'Profiel succesvol bijgewerkt', type: 'success' });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      }
    } catch (err: any) {
      toast({
        title: 'Fout bij opslaan',
        description: err.message || 'Probeer het opnieuw.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const heightInMeters = formData.height / 100;
  const bmiValue =
    heightInMeters > 0
      ? (formData.weight / (heightInMeters * heightInMeters)).toFixed(1)
      : '0.0';
  const bmiPercent = Math.min(100, Math.max(0, (Number(bmiValue) / 40) * 100));

  const bmr =
    formData.gender === 'Man'
      ? 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5
      : 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
  const dailyCaloriesMax = Math.round(bmr * 1.2);

  const displayAvatar =
    formData.imageUrl.trim() ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1A756A&color=fff&size=150`;

  const renderCheckboxGroup = (
    field: 'conditions' | 'diets' | 'allergies' | 'likes' | 'dislikes',
    options: string[],
    label: string,
  ) => (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <label
            key={opt}
            className="flex items-center gap-1.5 cursor-pointer text-sm bg-[var(--muted-bg)] px-3 py-1.5 rounded-full border border-[var(--border-color)]"
          >
            <input
              type="checkbox"
              checked={formData[field].includes(opt)}
              onChange={() => handleCheckboxToggle(field, opt)}
              className="accent-[#1A756A]"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PROFILE DISPLAY */}
        <div className="lg:col-span-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm space-y-6 flex flex-col items-center relative overflow-hidden">
          <div className="relative group w-32 h-32 mt-4 z-10">
            <img
              src={displayAvatar}
              alt="Profielfoto"
              className="w-32 h-32 object-cover rounded-full border-4 border-slate-100 dark:border-slate-800 shadow-md transition-transform group-hover:scale-105"
            />
            <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Upload className="w-4 h-4 mb-1" /> Foto Uploaden
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center space-y-1 w-full border-b border-[var(--border-color)] pb-4 z-10">
            <h3 className="text-2xl font-bold tracking-tight truncate">{formData.name}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {formData.gender} • {formData.age} jaar
            </p>
          </div>

          <div className="w-full space-y-3 z-10">
            <div className="bg-[var(--muted-bg)] p-4 rounded-2xl flex items-center justify-between border border-[var(--border-color)]/30">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
                  <LayoutDashboard className="w-3 h-3 text-[#1A756A]" /> Biometrische Waarden
                </h4>
                <p className="text-sm font-bold">Body Mass Index</p>
                <span className="text-[11px] text-gray-400 font-medium">
                  Status:{' '}
                  {Number(bmiValue) < 18.5
                    ? 'Ondergewicht'
                    : Number(bmiValue) < 25
                    ? 'Gezond'
                    : 'Overgewicht'}
                </span>
              </div>
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-inner"
                  style={{
                    background: `conic-gradient(#1A756A 0% ${bmiPercent}%, #e2e8f0 ${bmiPercent}% 100%)`,
                  }}
                >
                  <div className="w-10 h-10 bg-[var(--card-bg)] rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold">{bmiValue}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--muted-bg)] p-3 rounded-xl border border-[var(--border-color)]/30 text-center">
                <Flame className="w-4 h-4 mx-auto text-[#1A756A] mb-1" />
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Energiebudget
                </p>
                <p className="text-sm font-bold">{dailyCaloriesMax} kcal</p>
                <p className="text-[9px] text-gray-400">Aanbevolen limiet / dag</p>
              </div>
              <div className="bg-[var(--muted-bg)] p-3 rounded-xl border border-[var(--border-color)]/30 text-center">
                <Ruler className="w-4 h-4 mx-auto text-[#1A756A] mb-1" />
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Lengte
                </p>
                <p className="text-sm font-bold">{formData.height} cm</p>
              </div>
              <div className="bg-[var(--muted-bg)] p-3 rounded-xl border border-[var(--border-color)]/30 text-center col-span-2">
                <Scale className="w-4 h-4 mx-auto text-[#1A756A] mb-1" />
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Gewicht
                </p>
                <p className="text-sm font-bold">{formData.weight} kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT OPERATIONS PANEL */}
        <div className="lg:col-span-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
          <div className="flex gap-2 mb-6 border-b border-[var(--border-color)] pb-2">
            {tabs.map((t: string) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t as typeof activeTab)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer focus:outline-none ${
                  activeTab === t
                    ? 'bg-[#1A756A] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 bg-transparent'
                }`}
              >
                {t === 'basis'
                  ? '1. Profiel & Bio'
                  : t === 'medisch'
                  ? '2. Medische Status'
                  : '3. Voorkeuren'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave}>
            {activeTab === 'basis' && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold">Basisidentiteit & Biometrie</h4>
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Gebruikersnaam</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => {
                        const upd = { ...prev, name: val };
                        localStorage.setItem('surihealth_profile_cache', JSON.stringify(upd));
                        return upd;
                      });
                    }}
                    className="w-full px-4 py-3 bg-[var(--muted-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Leeftijd</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setFormData((prev) => {
                          const upd = { ...prev, age: val };
                          localStorage.setItem('surihealth_profile_cache', JSON.stringify(upd));
                          return upd;
                        });
                      }}
                      className="w-full px-4 py-3 bg-[var(--muted-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Geslacht</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => {
                          const upd = { ...prev, gender: val };
                          localStorage.setItem('surihealth_profile_cache', JSON.stringify(upd));
                          return upd;
                        });
                      }}
                      className="w-full px-4 py-3 bg-[var(--muted-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                    >
                      <option>Man</option>
                      <option>Vrouw</option>
                      <option>Anders</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Lengte (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setFormData((prev) => {
                          const upd = { ...prev, height: val };
                          localStorage.setItem('surihealth_profile_cache', JSON.stringify(upd));
                          return upd;
                        });
                      }}
                      className="w-full px-4 py-3 bg-[var(--muted-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Gewicht (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setFormData((prev) => {
                          const upd = { ...prev, weight: val };
                          localStorage.setItem('surihealth_profile_cache', JSON.stringify(upd));
                          return upd;
                        });
                      }}
                      className="w-full px-4 py-3 bg-[var(--muted-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medisch' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold">Medische gegevens</h4>
                {renderCheckboxGroup('conditions', conditionOptions, 'Aandoeningen')}
                {renderCheckboxGroup('diets', dietOptions, 'Dieetwensen')}
                {renderCheckboxGroup('allergies', allergyOptions, 'Allergieën')}
              </div>
            )}

            {activeTab === 'voorkeuren' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold">Voedingsvoorkeuren</h4>
                {renderCheckboxGroup('likes', ingredientOptions, 'Wat vind je lekker?')}
                {renderCheckboxGroup('dislikes', ingredientOptions, 'Wat eet je liever niet?')}
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-[var(--border-color)]">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1A756A] hover:bg-[#146053] text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {loading ? 'Bezig met opslaan...' : 'Profiel Opslaan & Herberekenen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}