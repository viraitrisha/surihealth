import { useState } from 'react';
import { authClient } from '../auth/auth-client';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '#/hooks/use-toast';
import { useLanguage } from '../hooks/use-language'; 
import { useFontSize } from './font-resize-toggle';
import { deleteUserAccountOnServer } from '../server-functions/auth';
import { 
  X, 
  Settings, 
  Sun, 
  Moon, 
  Type, 
  Languages, 
  LogOut, 
  Trash2, 
  User,
  AlertTriangle,
  Loader2,
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react';

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onThemeToggle: (theme: 'light' | 'dark') => void;
  currentTheme: 'light' | 'dark';
};

export function SettingsDrawer({
  isOpen,
  onClose,
  onOpenProfile,
  onThemeToggle,
  currentTheme,
}: SettingsDrawerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { language, setLanguage, t } = useLanguage();
  const { fontSize, setFontSize } = useFontSize();

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authClient.signOut();
      toast({
        title: t('Succesvol uitgelogd', 'Successfully logged out'),
        description: t('Tot ziens bij SuriHealth!', 'See you soon at SuriHealth!'),
        type: 'success',
      });
      onClose();
      navigate({ to: '/login' });
    } catch (err) {
      toast({ title: t('Fout bij uitloggen', 'Error logging out'), type: 'error' });
    } finally {
      setLogoutLoading(false);
    }
  };

const handleDeleteAccount = async () => {
  setDeleteLoading(true);
  try {
    const result = await deleteUserAccountOnServer();

    if (result.success) {
      localStorage.removeItem('surihealth_profile_cache');
      
      toast({
        title: t('Account permanent gewist', 'Account permanently deleted'),
        description: t('Uw gegevens zijn succesvol verwijderd.', 'Your data has been successfully wiped.'),
        type: 'success',
      });
      
      onClose();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/register';
      }
    }
  } catch (err: any) {
    toast({
      title: t('Fout bij verwijderen', 'Error deleting account'),
      description: err.message || 'Probeer het later opnieuw.',
      type: 'error',
    });
  } finally {
    setDeleteLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Lade-container */}
      <div className="relative w-full max-w-sm h-full bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-[#1A756A] dark:text-[#2D9C8F]" />
            <h2 className="text-xl font-black tracking-tight">{t('Instellingen', 'Settings')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all cursor-pointer focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Inhoud */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* Weergave & Stijl */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {t('Weergave & Stijl', 'Appearance & Style')}
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => onThemeToggle('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all cursor-pointer focus:outline-none ${
                  currentTheme === 'light'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'
                }`}
              >
                <Sun className="h-4 w-4" /> {t('Licht', 'Light')}
              </button>
              <button
                onClick={() => onThemeToggle('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all cursor-pointer focus:outline-none ${
                  currentTheme === 'dark'
                    ? 'bg-slate-800 border-slate-600 text-white shadow-sm ring-1 ring-white/10'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'
                }`}
              >
                <Moon className="h-4 w-4" /> {t('Donker', 'Dark')}
              </button>
            </div>
          </div>

          {/* Taalwisselaar */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="h-4 w-4 text-teal-600" /> <span>{t('Taal', 'Language')}</span>
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('NL')}
                className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer focus:outline-none ${
                  language === 'NL'
                    ? 'border-[#1A756A] bg-teal-50 text-[#1A756A] dark:bg-teal-950/30 dark:text-teal-400'
                    : 'border-gray-200 bg-white text-gray-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400'
                }`}
              >
                Nederlands
              </button>
              <button
                onClick={() => setLanguage('EN')}
                className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer focus:outline-none ${
                  language === 'EN'
                    ? 'border-[#1A756A] bg-teal-50 text-[#1A756A] dark:bg-teal-950/30 dark:text-teal-400'
                    : 'border-gray-200 bg-white text-gray-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Interactieve Aa Regelaar */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="h-4 w-4 text-teal-600" /> <span>{t('Tekstgrootte (Aa)', 'Text Size')}</span>
            </h4>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
              <span className="text-xs font-bold text-gray-500">
                {t('Huidig: ', 'Current: ')} <strong className="text-slate-800 dark:text-white text-sm font-black">{fontSize}%</strong>
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setFontSize(Math.max(50, fontSize - 10))}
                  className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 cursor-pointer focus:outline-none"
                  title={t('Verkleinen', 'Decrease')}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize(100)}
                  className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 cursor-pointer focus:outline-none"
                  title={t('Standaard', 'Reset')}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                  className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 cursor-pointer focus:outline-none"
                  title={t('Vergroten', 'Increase')}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-slate-800" />

          {/* Profiel Aanpassen Link */}
          <button
            type="button"
            onClick={() => { onOpenProfile(); onClose(); }}
            className="w-full py-3 text-sm font-bold text-white bg-[#1A756A] hover:bg-[#13574e] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <User className="h-4 w-4" />
            {t('Gezondheidsprofiel Bewerken', 'Edit Health Profile')}
          </button>

          {/* Account Wissen Noodknop */}
          <div className="pt-2 space-y-2">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
              >
                <Trash2 className="h-4 w-4" />
                {t('Account Permanent Wissen', 'Permanently Delete Account')}
              </button>
            ) : (
              <div className="bg-red-50 dark:bg-red-950/10 p-4 rounded-xl border border-red-200 dark:border-red-900/50 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5 text-red-800 dark:text-red-400 text-xs">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="font-semibold leading-normal">
                    {t(
                      'Weet u het zeker? Dit wist permanent uw opgeslagen favorieten, medische condities en planners uit PostgreSQL.',
                      'Are you sure? This permanently deletes your favorites, medical conditions, and data from PostgreSQL.'
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 cursor-pointer focus:outline-none"
                  >
                    {t('Annuleren', 'Cancel')}
                  </button>
                  <button
                    type="button"
                    disabled={deleteLoading}
                    onClick={handleDeleteAccount}
                    className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 flex items-center justify-center gap-1 cursor-pointer focus:outline-none disabled:opacity-50"
                  >
                    {deleteLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                    {t('Ja, Wis Alles', 'Yes, Wipe Data')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sluitings- & Logoutbalk onderin */}
          <button
            type="button"
            disabled={logoutLoading}
            onClick={handleLogout}
            className="w-full py-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none disabled:opacity-50"
          >
            {logoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {t('Veilig Uitloggen', 'Sign Out Safely')}
          </button>
        </div>
      </div>
    </div>
  );
}