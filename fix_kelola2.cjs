const fs = require('fs');

let code = fs.readFileSync('src/components/KelolaDataTab.tsx', 'utf8');

// Update styling of KelolaDataTab
code = code.replace(
  '<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">',
  '<div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200">'
);
code = code.replace(
  '<h2 className="text-xl font-bold text-slate-800 mb-2">Sinkronisasi Cloud (Google Sheets)</h2>',
  '<h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Sinkronisasi Cloud (Google Sheets)</h2>'
);
code = code.replace(
  'className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"',
  'className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-emerald-700/20"'
);
code = code.replace(
  'className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"',
  'className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-700/20"'
);

fs.writeFileSync('src/components/KelolaDataTab.tsx', code);
