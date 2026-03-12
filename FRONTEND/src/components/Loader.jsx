export default function Loader({ message = 'Processing...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      {/* Spinning rings */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-cyan-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-indigo-400 animate-spin [animation-direction:reverse] [animation-duration:0.8s]" />
        <div className="absolute inset-[14px] rounded-full bg-indigo-500/20" />
      </div>
      <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  )
}
