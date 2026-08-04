// src/routes/__root.tsx
import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { LanguageContext } from '../hooks/use-language';
import type { LanguageType } from '../hooks/use-language';
import { PublicHeader } from '../components/public-header';
import { DashboardHeader } from '../components/dashboard-header';
import { AdminHeader } from '../components/admin/admin-header';
import { Footer } from '../components/footer';
import { FontSizeProvider } from '../components/font-resize-toggle';
import { Toaster } from '../hooks/use-toast';

import '../styles/global.css';

function RootLayout() {
  const routerState = useRouterState();
  const isDashboard = routerState.location.pathname.startsWith('/dashboard');
  const isAdminRoute = routerState.location.pathname.startsWith('/admin');

  const [language, setLanguageState] = useState<LanguageType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('surihealth_lang') as LanguageType) || 'NL';
    }
    return 'NL';
  });

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('surihealth_lang', lang);
  };

  const t = (nl: string, en: string) => (language === 'NL' ? nl : en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <html lang={language.toLowerCase()}>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined' && typeof globalThis.Buffer === 'undefined') {
                  (function() {
                    function Buffer(arg, encodingOrOffset, length) {
                      if (typeof arg === 'number') {
                        return Buffer.alloc(arg);
                      }
                      return Buffer.from(arg, encodingOrOffset, length);
                    }
                    
                    function createBufferInstance(size) {
                      const ui8 = new Uint8Array(size);
                      Object.setPrototypeOf(ui8, Buffer.prototype);
                      return ui8;
                    }

                    Buffer.alloc = function(size) { return createBufferInstance(size); };
                    Buffer.allocUnsafe = function(size) { return createBufferInstance(size); };
                    Buffer.allocUnsafeSlow = function(size) { return createBufferInstance(size); };
                    
                    Buffer.from = function(value, encodingOrOffset, length) {
                      if (typeof value === 'string') {
                        const b = new TextEncoder().encode(value);
                        Object.setPrototypeOf(b, Buffer.prototype);
                        return b;
                      }
                      if (value instanceof Uint8Array) {
                        const b = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
                        Object.setPrototypeOf(b, Buffer.prototype);
                        return b;
                      }
                      const b = new Uint8Array(value || []);
                      Object.setPrototypeOf(b, Buffer.prototype);
                      return b;
                    };

                    Buffer.isBuffer = function isBuffer(b) { 
                      return b != null && b._isBuffer === true; 
                    };
                    Buffer.isEncoding = function isEncoding() { return true; };
                    
                    Buffer.concat = function concat(list, length) {
                      if (!list || list.length === 0) return Buffer.alloc(0);
                      if (length === undefined) {
                        length = 0;
                        for (let i = 0; i < list.length; i++) length += list[i].length;
                      }
                      const buffer = Buffer.alloc(length);
                      let pos = 0;
                      for (let i = 0; i < list.length; i++) {
                        const buf = list[i];
                        buffer.set(buf, pos);
                        pos += buf.length;
                      }
                      return buffer;
                    };

                    Buffer.byteLength = function byteLength(string) {
                      if (typeof string !== 'string') return string ? (string.length || 0) : 0;
                      return new TextEncoder().encode(string).length;
                    };

                    Buffer.prototype = Object.create(Uint8Array.prototype);
                    Buffer.prototype.constructor = Buffer;
                    Buffer.prototype._isBuffer = true;
                    
                    Buffer.prototype.write = function write(string, offset = 0) {
                      const encoded = new TextEncoder().encode(string);
                      const len = Math.min(encoded.length, this.length - offset);
                      this.set(encoded.subarray(0, len), offset);
                      return len;
                    };

                    Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset = 0) {
                      this[offset] = (value >>> 24) & 0xff;
                      this[offset + 1] = (value >>> 16) & 0xff;
                      this[offset + 2] = (value >>> 8) & 0xff;
                      this[offset + 3] = value & 0xff;
                      return offset + 4;
                    };

                    Buffer.prototype.slice = function slice(start, end) {
                      return this.subarray(start, end);
                    };

                    Buffer.prototype.toString = function toString(encoding, start, end) {
                      return new TextDecoder().decode(this.subarray(start, end));
                    };

                    globalThis.Buffer = Buffer;
                  })();
                }
              `,
            }}
          />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>SuriHealth</title>
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <HeadContent />
        </head>
        <body className="min-h-screen flex flex-col bg-white">
          <FontSizeProvider>
            {isAdminRoute ? <AdminHeader /> : isDashboard ? <DashboardHeader /> : <PublicHeader />}
            
            <main className="flex-1 pt-20 min-h-[calc(110vh-80px)]">
              <Outlet />
            </main>
            
            <Footer />
          </FontSizeProvider>

          <Toaster />
          <Scripts />
        </body>
      </html>
    </LanguageContext.Provider>
  );
}

function NotFound() {
  return (
    <div className="p-8 text-center m-6 bg-gray-50 rounded-2xl border border-gray-100 min-h-[50vh] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-black text-slate-800">404</h1>
      <p className="text-sm text-gray-500 mt-1">Pagina niet gevonden</p>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
