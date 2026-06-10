// check-footer.js
const fs = require('fs');
const tw = fs.readFileSync('tailwind-built.css', 'utf8');
const cls = ['bg-[#fdf8f5]', 'border-t', 'border-[#e8ddd0]', 'text-[#8b7355]',
             'font-sans', 'max-w-6xl', 'mx-auto', 'px-4', 'sm:px-6', 'py-10',
             'grid', 'grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-5',
             'gap-x-8', 'gap-y-6', 'text-[1.25rem]', 'leading-[1.6]', 'mb-3',
             'font-bold', 'gap-1.5', 'text-xs', 'tracking-[0.1em]',
             'min-h-[48px]', 'min-h-[28px]', 'leading-[28px]', 'text-sm',
             'hover:underline', 'decoration-1', 'underline-offset-2',
             'border-[#e6d5c3]', 'hover:border-[#6b5344]', 'hover:text-[#6b5344]',
             'transition-colors', 'duration-200', 'min-w-[48px]', 'sm:min-w-0',
             'sm:min-h-0', 'justify-center', 'w-3.5', 'h-3.5', 'sm:inline',
             'sm:flex-row', 'sm:px-6', 'sm:text-left', 'sm:text-4xl', 'md:hidden',
             'md:block', 'text-[#7a6455]', 'hover:text-[#6b5344]', 'py-1.5', 'px-3',
             'rounded', 'flex-shrink-0', 'flex', 'items-center', 'inline-flex',
             'space-y-2', 'list-none', 'text-[0.9rem]'];
for (const c of cls) {
  let s = '';
  for (const ch of c) {
    if (':[]#/()%\\,!?+=$^{}|<>&~;\'"'.includes(ch)) s += '\\' + ch;
    else s += ch;
  }
  const ok = tw.includes('.' + s);
  console.log((ok ? 'OK   ' : 'MISS ') + c);
}
