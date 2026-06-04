import Image from "next/image";

import doorImage from "@/public/Door.jpg";

type AuthDoorAccentProps = {
  className?: string;
};

export default function AuthDoorAccent({ className = "" }: AuthDoorAccentProps) {
  return (
    <div
      className={`pointer-events-none absolute ${className} animate-jmo-float`}
      aria-hidden="true"
    >
      <div className="relative h-28 w-24 rounded-[28px] border border-white/22 bg-white/8 p-2 backdrop-blur-md shadow-[0_18px_48px_rgba(19,8,42,0.24)]">
        <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/16 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
          <Image
            src={doorImage}
            alt=""
            fill
            sizes="96px"
            className="object-cover brightness-[1.05] contrast-[1.08] saturate-[0.92]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(116,39,179,0.18),rgba(18,8,42,0.22))]" />
        </div>
      </div>
    </div>
  );
}
