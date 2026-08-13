const fs = require('fs');

let code = fs.readFileSync('src/components/KelolaDataTab.tsx', 'utf8');

// Update styling of KelolaDataTab to be simpler and minimalist
code = code.replace(
  /<div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200">/g,
  '<div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/60">'
);
code = code.replace(
  /<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">/g,
  '<div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-4">'
);
code = code.replace(
  'className="flex flex-col items-center justify-center space-y-2 w-full p-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"',
  'className="flex flex-col items-center justify-center space-y-2 w-full p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"'
);
code = code.replace(
  'className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-emerald-700/20"',
  'className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"'
);
code = code.replace(
  'className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-700/20"',
  'className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-medium transition-colors border border-slate-200"'
);

fs.writeFileSync('src/components/KelolaDataTab.tsx', code);
