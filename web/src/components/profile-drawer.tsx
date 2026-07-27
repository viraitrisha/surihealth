import { useState, useEffect } from 'react';
import { submitProfileSetup } from '../server-functions/profile';
import { getUserSession } from '../server-functions/auth';
import { useToast } from '#/hooks/use-toast';
import {
  X,
  User as UserIcon,
  Loader2,
  Save,
  Activity,
  Heart,
  Ban,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

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

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('basis');

  const [formData, setFormData] = useState({
    name: 'Gebruiker',
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

  const mapDatabaseToFrontend = (conditionsList: string[] | null): string[] => {
    if (!conditionsList) return [];
    return conditionsList.map((c) =>
      c === 'Diabetic' ? 'Diabeet (Suikerziekte)' : c
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchFreshData = async () => {
      try {
        const cachedProfile = localStorage.getItem('surihealth_profile_cache');
        if (cachedProfile) {
          const parsed = JSON.parse(cachedProfile);
          setFormData(parsed);
          return;
        }

        const sessionData = (await getUserSession()) as any;
        if (sessionData?.user) {
          const user = sessionData.user;
          const profile = sessionData.profile || {};

          const initialData = {
            name: user.name || 'Gebruiker',
            age: profile.age || 25,
            gender: profile.gender || 'Vrouw',
            height: profile.height || 170,
            weight: profile.weight || 70,
            conditions: mapDatabaseToFrontend(profile.conditions),
            diets: profile.diets || [],
            allergies: profile.allergies || [],
            likes: profile.likes || [],
            dislikes: profile.dislikes || [],
          };

          setFormData(initialData);
          localStorage.setItem(
            'surihealth_profile_cache',
            JSON.stringify(initialData)
          );
        }
      } catch (err) {
        console.error('Kon sessie-data niet ophalen', err);
      }
    };

    fetchFreshData();
  }, [isOpen]);

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    formData.name
  )}&background=1A756A&color=fff&size=128`;

  const handleCheckboxToggle = (
    field: 'conditions' | 'diets' | 'allergies' | 'likes' | 'dislikes',
    option: string
  ) => {
    setFormData((prev) => {
      const currentList = prev[field];
      if (option === 'Geen' || option === 'Geen speciaal dieet') {
        return { ...prev, [field]: [option] };
      }
      const filteredList = currentList.filter(
        (item) => item !== 'Geen' && item !== 'Geen speciaal dieet'
      );
      if (filteredList.includes(option)) {
        return {
          ...prev,
          [field]: filteredList.filter((item) => item !== option),
        };
      }
      return { ...prev, [field]: [...filteredList, option] };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem('surihealth_profile_cache', JSON.stringify(formData));

      const mappedConditions = formData.conditions.map((c) =>
        c === 'Diabeet (Suikerziekte)' ? 'Diabetic' : c
      );

      const result = await submitProfileSetup({
        data: {
          age: Number(formData.age),
          gender: formData.gender,
          height: Number(formData.height),
          weight: Number(formData.weight),
          conditions: mappedConditions,
          diets: formData.diets,
          allergies: formData.allergies,
          likes: formData.likes,
          dislikes: formData.dislikes,
        },
      });

      if (result.success) {
        toast({
          title: 'Profiel bijgewerkt!',
          description:
            'Uw wijzigingen zijn succesvol opgeslagen en de maaltijdplanner is opnieuw afgestemd.',
          type: 'success',
        });

        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        onClose();
      }
    } catch (err: any) {
      toast({
        title: 'Fout bij opslaan',
        description: err.message || 'Probeer het later opnieuw.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Schuifpaneel container */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Paneel Bovenkant */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] text-white">
          <div className="flex items-center gap-3">
            <img
              src={defaultAvatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-white/50 shadow-sm"
            />
            <div>
              <h2 className="font-black text-lg leading-tight">{formData.name}</h2>
              <p className="text-white/80 text-xs font-medium">
                Gezondheidsprofiel bewerken
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white focus:outline-none cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Bladen */}
        <div className="flex border-b border-gray-100 bg-gray-50 px-4">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all capitalize focus:outline-none cursor-pointer ${
                activeTab === t
                  ? 'border-[#1A756A] text-[#1A756A]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Paneel Midden */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form
            id="drawer-profile-form"
            onSubmit={handleSave}
            className="space-y-6"
          >
            {/* TAB 1: BASISBIOMETRIE */}
            {activeTab === 'basis' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-[#1A756A]" /> Biometrische
                  Waarden
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Leeftijd
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          age: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl font-bold text-sm text-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Geslacht
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl font-bold text-sm text-gray-900 focus:outline-none"
                    >
                      <option value="Man">Man</option>
                      <option value="Vrouw">Vrouw</option>
                      <option value="Anders">Anders</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Lengte (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          height: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl font-bold text-sm text-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Gewicht (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weight: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl font-bold text-sm text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MEDISCH */}
            {activeTab === 'medisch' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <section>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Activity className="h-4 w-4 text-[#1A756A]" /> Medische
                    Condities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {conditionOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.conditions.includes(opt)}
                          onChange={() => handleCheckboxToggle('conditions', opt)}
                          className="h-4 w-4 rounded border-gray-300 text-[#1A756A] focus:ring-[#1A756A]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Heart className="h-4 w-4 text-[#1A756A]" /> Diëten
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dietOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.diets.includes(opt)}
                          onChange={() => handleCheckboxToggle('diets', opt)}
                          className="h-4 w-4 rounded border-gray-300 text-[#1A756A] focus:ring-[#1A756A]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Ban className="h-4 w-4 text-[#1A756A]" /> Allergieën
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allergyOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.allergies.includes(opt)}
                          onChange={() => handleCheckboxToggle('allergies', opt)}
                          className="h-4 w-4 rounded border-gray-300 text-[#1A756A] focus:ring-[#1A756A]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* TAB 3: VOORKEUREN */}
            {activeTab === 'voorkeuren' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <section>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <ThumbsUp className="h-4 w-4 text-[#1A756A]" /> Wat eet u
                    graag?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ingredientOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.likes.includes(opt)}
                          onChange={() => handleCheckboxToggle('likes', opt)}
                          className="h-4 w-4 rounded border-gray-300 text-[#1A756A] focus:ring-[#1A756A]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <ThumbsDown className="h-4 w-4 text-[#1A756A]" /> Wat
                    vermijdt u liever?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ingredientOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.dislikes.includes(opt)}
                          onChange={() => handleCheckboxToggle('dislikes', opt)}
                          className="h-4 w-4 rounded border-gray-300 text-[#1A756A] focus:ring-[#1A756A]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </form>
        </div>

        {/* Paneel Onderkant */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
          >
            Annuleren
          </button>
          <button
            type="submit"
            form="drawer-profile-form"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1A756A] text-white font-bold text-sm hover:bg-[#166258] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Opslaan
          </button>
        </div>
      </div>
    </div>
  );
}