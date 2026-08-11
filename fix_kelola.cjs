const fs = require('fs');

let code = fs.readFileSync('src/components/KelolaTab.tsx', 'utf8');

// Update styling of KelolaTab
code = code.replace(
  '<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">',
  '<div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200">'
);
code = code.replace(
  '<h2 className="text-xl font-bold text-slate-800 mb-2">Sinkronisasi Cloud (Google Sheets)</h2>',
  '<h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Sinkronisasi Cloud (Google Sheets)</h2>'
);
code = code.replace(
  'className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"',
  'className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-emerald-700/20"'
);
code = code.replace(
  'className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"',
  'className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-700/20"'
);
code = code.replace(
  'className="flex items-center justify-center space-x-2 w-full p-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"',
  'className="flex flex-col items-center justify-center space-y-2 w-full p-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"'
);

fs.writeFileSync('src/components/KelolaTab.tsx', code);
