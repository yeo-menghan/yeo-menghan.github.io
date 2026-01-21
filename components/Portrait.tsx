// components/Portrait.tsx
export default function Portrait() {
  return (
    <div className="flex justify-center md:justify-start">
      <div className="w-full max-w-[200px] overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm">
        <img
          src="/yeo-menghan.jpg"
          alt="Meng Han"
          className="block h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}