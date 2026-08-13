const fs = require('fs');

let code = fs.readFileSync('src/components/RekapTab.tsx', 'utf8');

// Fix Ziyadah card
code = code.replace(
  '<div className="bg-emerald-50/70 p-3 sm:p-4 rounded-2xl border border-emerald-100 flex items-center space-x-2 sm:space-x-3">',
  '<div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-2 sm:space-x-3">'
);
code = code.replace(
  '<div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-700/20">',
  '<div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">'
);
code = code.replace(
  '<p className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-800 tracking-wider leading-tight">Ziyadah Baru</p>',
  '<p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-tight">Ziyadah Baru</p>'
);
code = code.replace(
  '<h3 className="text-lg sm:text-xl font-bold text-emerald-950 mt-0.5 leading-tight">{totalZiyadah} <span className="text-xs sm:text-sm font-semibold">Setoran</span></h3>',
  '<h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 leading-tight">{totalZiyadah} <span className="text-xs sm:text-sm font-semibold text-slate-400">Setoran</span></h3>'
);

// Fix Muraja'ah card
code = code.replace(
  '<div className="bg-teal-50/70 p-3 sm:p-4 rounded-2xl border border-teal-100 flex items-center space-x-2 sm:space-x-3">',
  '<div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-2 sm:space-x-3">'
);
code = code.replace(
  '<div className="p-3 bg-teal-600 text-white rounded-xl shadow-md shadow-teal-700/20">',
  '<div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">'
);
code = code.replace(
  '<p className="text-[9px] sm:text-[10px] uppercase font-bold text-teal-800 tracking-wider leading-tight">Muraja\'ah</p>',
  '<p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-tight">Muraja\'ah</p>'
);
code = code.replace(
  '<h3 className="text-lg sm:text-xl font-bold text-teal-950 mt-0.5 leading-tight">{totalMurajaah} <span className="text-xs sm:text-sm font-semibold">Setoran</span></h3>',
  '<h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 leading-tight">{totalMurajaah} <span className="text-xs sm:text-sm font-semibold text-slate-400">Setoran</span></h3>'
);

// Fix Tasmi' card
code = code.replace(
  '<div className="bg-amber-50/70 p-3 sm:p-4 rounded-2xl border border-amber-100 flex items-center space-x-2 sm:space-x-3">',
  '<div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-2 sm:space-x-3">'
);
code = code.replace(
  '<div className="p-3 bg-amber-600 text-white rounded-xl shadow-md shadow-amber-700/20">',
  '<div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">'
);
code = code.replace(
  '<p className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-800 tracking-wider leading-tight">Ujian Tasmi\'</p>',
  '<p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-tight">Ujian Tasmi\'</p>'
);
code = code.replace(
  '<h3 className="text-lg sm:text-xl font-bold text-amber-950 mt-0.5 leading-tight">{totalTasmi} <span className="text-xs sm:text-sm font-semibold">Kali</span></h3>',
  '<h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 leading-tight">{totalTasmi} <span className="text-xs sm:text-sm font-semibold text-slate-400">Kali</span></h3>'
);

// Fix Kehadiran card
code = code.replace(
  '<div className="bg-slate-900 text-white p-3 sm:p-4 rounded-2xl border border-slate-800 flex items-center space-x-2 sm:space-x-3">',
  '<div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-2 sm:space-x-3">'
);
code = code.replace(
  '<div className="p-3 bg-emerald-500 text-slate-950 rounded-xl font-bold">',
  '<div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">'
);
code = code.replace(
  '<p className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-400 tracking-wider leading-tight">Tingkat Kehadiran</p>',
  '<p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-tight">Kehadiran</p>'
);
code = code.replace(
  '<h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 leading-tight">{attendancePercent}%</h3>',
  '<h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 leading-tight">{attendancePercent}%</h3>'
);

fs.writeFileSync('src/components/RekapTab.tsx', code);
