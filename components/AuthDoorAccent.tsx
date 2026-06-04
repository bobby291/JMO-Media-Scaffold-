type AuthDoorAccentProps = {
  className?: string;
};

export default function AuthDoorAccent({ className = "" }: AuthDoorAccentProps) {
  return (
    <div
      className={`pointer-events-none absolute ${className} animate-jmo-float`}
      aria-hidden="true"
    >
      <div className="relative h-28 w-24">
        <div className="absolute inset-0 rounded-[28px] border border-white/22 bg-white/8 backdrop-blur-md shadow-[0_18px_48px_rgba(19,8,42,0.24)]" />
        <div className="absolute inset-x-5 inset-y-4 rounded-[18px] border border-white/18 bg-[#4e1f78]/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
        <div className="absolute inset-y-6 left-[42%] w-[16%] rounded-full bg-white/90 blur-[2px] shadow-[0_0_24px_rgba(255,255,255,0.85)]" />
        <div className="absolute bottom-4 left-1/2 h-10 w-14 -translate-x-1/2 rounded-full bg-[#f2d77a]/45 blur-xl" />
        <div
          className="absolute inset-y-5 right-5 w-[34%] origin-left rounded-r-[16px] rounded-l-[8px] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(199,168,255,0.16))] shadow-[0_10px_24px_rgba(10,4,26,0.28)]"
          style={{ transform: "perspective(120px) rotateY(-34deg)" }}
        />
      </div>
    </div>
  );
}
