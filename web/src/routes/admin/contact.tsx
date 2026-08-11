import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { adminGetContactMessages, adminReplyToMessage } from '../../server-functions/admin';
import { useToast } from '#/hooks/use-toast';
import { AdminSidebar } from '../../components/admin/admin-sidebar';
import {
  MessageSquare,
  Mail,
  User,
  Clock,
  ChevronRight,
  CornerUpLeft,
  Send,
  Loader2,
  Search,
  Inbox,
  Leaf,
} from 'lucide-react';

export const Route = (createFileRoute)('/admin/contact')({
  loader: async () => {
    try {
      const messages = await adminGetContactMessages();
      return { messages: messages || [] };
    } catch (err) {
      throw new Error('Niet geautoriseerd');
    }
  },
  component: AdminContactInboxPage,
});

function AdminContactInboxPage() {
  const { messages } = Route.useLoaderData() as { messages: any[] };
  const { toast } = useToast();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState<boolean>(false);

  const filteredMessages = messages.filter((msg: any) => {
    return (
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSendInboxReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    setSending(true);
    try {
      await adminReplyToMessage({ data: { messageId: selectedMessage.id, replyText } });
      toast({
        title: 'Antwoord verwerkt',
        description: 'De mail-client wordt nu geopend.',
        type: 'success',
      });

      if (typeof window !== 'undefined') {
        window.location.href = `mailto:${selectedMessage.email}?subject=SuriHealth Ondersteuning&body=${encodeURIComponent(replyText)}`;
      }

      setReplyText('');
      setSelectedMessage(null);
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij verwerken', description: err.message, type: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
      <AdminSidebar />

      {/* Decoratieve bladeren */}
      <Leaf className="absolute -top-10 -left-10 w-40 h-40 text-[#1A756A]/10 rotate-12 pointer-events-none" />
      <Leaf className="absolute -bottom-8 -right-8 w-36 h-36 text-[#1A756A]/10 -rotate-12 pointer-events-none" />
      <Leaf className="absolute top-1/4 right-1/4 w-24 h-24 text-[#1A756A]/10 rotate-45 pointer-events-none" />

      <main className="flex-1 ml-72 p-10 pt-0 space-y-8 relative z-10">
        <div className="h-6"></div>

        {/* GRADIENT BANNER */}
        <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
              <MessageSquare className="h-8 w-8" />
              <span>Support Inbox</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base font-medium max-w-xl">
              Beheer en beantwoord binnengekomen contactformulieren van gebruikers.
            </p>
          </div>
          <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0 min-w-[100px]">
            <span className="block text-3xl font-black leading-none">{messages.length}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mt-1">Berichten</span>
          </div>
        </div>

        {/* INBOX GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LINKER KOLOM: TICKETS */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-4 h-[68vh] flex flex-col">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Zoek op afzender, e-mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A756A] text-gray-900 font-medium"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredMessages.map((msg: any) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setReplyText('');
                  }}
                  className={`p-4 rounded-2xl border text-xs transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    selectedMessage?.id === msg.id
                      ? 'bg-teal-50/40 border-[#1A756A] shadow-sm'
                      : 'bg-slate-50/30 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-bold text-slate-800 truncate">{msg.name}</h4>
                      <span className="text-[9px] font-bold text-gray-400 shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString('nl-SR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-400 font-semibold truncate">{msg.email}</p>
                    <p className="text-slate-600 line-clamp-2 pt-1 font-medium leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 self-center shrink-0" />
                </div>
              ))}
              {filteredMessages.length === 0 && (
                <div className="text-center py-16 text-gray-400 font-bold space-y-2 flex flex-col items-center">
                  <Inbox className="w-8 h-8 text-gray-200" />
                  <p>Geen support tickets gevonden.</p>
                </div>
              )}
            </div>
          </div>

          {/* RECHTER KOLOM: DETAILS & ANTWOORD VELD */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-[68vh] flex flex-col justify-between">
            {selectedMessage ? (
              <div className="flex-1 flex flex-col justify-between space-y-6 animate-in fade-in duration-150">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1A756A] flex items-center justify-center font-bold shadow-inner">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <h3 className="font-black text-slate-800 text-sm">{selectedMessage.name}</h3>
                      <p className="text-gray-400 font-bold flex items-center gap-1 mt-1">
                        <Mail className="w-3.5 h-3.5" /> {selectedMessage.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border p-5 rounded-2xl text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-wrap max-h-48 overflow-y-auto shadow-inner">
                    {selectedMessage.message}
                  </div>

                  <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Ontvangen op:{' '}
                    {new Date(selectedMessage.createdAt).toLocaleString('nl-SR')}
                  </div>
                </div>

                <form onSubmit={handleSendInboxReply} className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-500">
                    <CornerUpLeft className="w-4 h-4 text-teal-600" /> Antwoord uitschrijven
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Typ hier uw officiële ondersteuningsreactie..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A756A] transition-all font-medium"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={sending || replyText.trim().length < 4}
                      className="inline-flex items-center gap-1.5 bg-[#1A756A] hover:bg-[#13574e] text-white font-black px-4 py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Beantwoorden & Mail openen</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-8 space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-300">
                  <MessageSquare className="w-10 h-10 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Geen bericht geselecteerd</h4>
                  <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto mt-1 leading-normal">
                    Selecteer een binnengekomen ticket aan de linkerzijde om de inhoud te
                    lezen en direct te beantwoorden.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}