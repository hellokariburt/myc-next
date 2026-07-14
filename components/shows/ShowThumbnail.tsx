const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-sky-600',
  'from-lime-500 to-green-600',
  'from-fuchsia-500 to-pink-600',
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h;
}

function initials(name: string): string {
  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function ShowThumbnail({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        width={64}
        height={64}
        loading="lazy"
        className="w-14 h-14 lg:w-16 lg:h-16 shrink-0 rounded-xl object-cover shadow-sm bg-slate-100"
      />
    );
  }
  const gradient = GRADIENTS[hashName(name) % GRADIENTS.length];
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 shrink-0 rounded-xl bg-gradient-to-br ${gradient} text-white font-black text-lg lg:text-xl select-none shadow-sm`}
    >
      {initials(name)}
    </div>
  );
}
