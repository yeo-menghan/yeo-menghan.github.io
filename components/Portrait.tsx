import Image from 'next/image';
export default function Portrait() {
  return (
    <div className="flex justify-center md:justify-start">
      <div className="w-full max-w-[200px] overflow-hidden rounded-xl border-2 border-slate-200 shadow-sm">
        <Image
          src="/yeo-menghan.jpg"
          alt="Meng Han"
          width={960}
          height={1280}
          priority
          className="block h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}