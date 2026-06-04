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
      <div className="relative h-28 w-24">
        <Image
          src={doorImage}
          alt=""
          fill
          sizes="96px"
          className="object-cover brightness-[1.05] contrast-[1.08] saturate-[0.92]"
        />
      </div>
    </div>
  );
}
