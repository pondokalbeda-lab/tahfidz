const fs = require('fs');
let code = fs.readFileSync('src/components/RekapTab.tsx', 'utf8');

// Fix Ziyadah Baru card
code = code.replace(
  '<div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 flex items-center space-x-3">',
  '<div className="bg-emerald-50/70 p-3 sm:p-4 rounded-2xl border border-emerald-100 flex items-center space-x-2 sm:space-x-3">'
);
code = code.replace(
  '              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Ziyadah Baru</span>\n              <h3 className="text-xl font-bold text-emerald-950 mt-0.5">{totalZiyadah} Setoran</h3>',
  '              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-800 tracking-wider leading-tight">Ziyadah Baru</p>\n              <h3 className="text-lg sm:text-xl font-bold text-emerald-950 mt-0.5 leading-tight">{totalZiyadah} <span className="text-xs sm:text-sm font-semibold">Setoran</span></h3>'
);

// Fix Murajaah card
code = code.replace(
  '<div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 flex items-center space-x-3">',
  '<div className="bg-teal-50/70 p-3 sm:p-4 rounded-2xl border border-teal-100 flex items-center space-x-2 sm:space-x-3">'
);
code = code.replace(
  '              <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">Muraja\'ah</span>\n              <h3 className="text-xl font-bold text-teal-950 mt-0.5">{totalMurajaah} Setoran</h3>',
  '              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-teal-800 tracking-wider leading-tight">Muraja\'ah</p>\n              <h3 className="text-lg sm:text-xl font-bold text-teal-950 mt-0.5 leading-tight">{totalMurajaah} <span className="text-xs sm:text-sm font-semibold">Setoran</span></h3>'
);

// Fix Tasmi card
code = code.replace(
  '<div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 flex items-center space-x-3">',
  '<div className="bg-amber-50/70 p-3 sm:p-4 rounded-2xl border border-amber-100 flex items-center space-x-2 sm:space-x-3">'
);
code = code.replace(
  '              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Ujian Tasmi\'</span>\n              <h3 className="text-xl font-bold text-amber-950 mt-0.5">{totalTasmi} Kali</h3>',
  '              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-800 tracking-wider leading-tight">Ujian Tasmi\'</p>\n              <h3 className="text-lg sm:text-xl font-bold text-amber-950 mt-0.5 leading-tight">{totalTasmi} <span className="text-xs sm:text-sm font-semibold">Kali</span></h3>'
);

// Fix Kehadiran card
code = code.replace(
  '<div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">',
  '<div className="bg-slate-900 text-white p-3 sm:p-4 rounded-2xl border border-slate-800 flex items-center space-x-2 sm:space-x-3">'
);
code = code.replace(
  '              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Tingkat Kehadiran</span>\n              <h3 className="text-xl font-bold text-white mt-0.5">{attendancePercent}%</h3>',
  '              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-400 tracking-wider leading-tight">Tingkat Kehadiran</p>\n              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 leading-tight">{attendancePercent}%</h3>'
);

// Ensure text containers have min-w-0 to prevent flex blowout
code = code.replace(
  /<div>\s*<p className="text-\[9px\]/g,
  '<div className="min-w-0 flex-1">\n              <p className="text-[9px]'
);

fs.writeFileSync('src/components/RekapTab.tsx', code);
