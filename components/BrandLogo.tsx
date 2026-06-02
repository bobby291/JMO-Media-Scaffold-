import Image from "next/image";
import Link from "next/link";

import logoImage from "@/app/Logo.webp";

type BrandLogoProps = {
  href?: string;
  size?: number;
  textClassName?: string;
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({
  href = "/",
  size = 56,
  textClassName = "text-2xl font-semibold tracking-tight md:text-3xl",
  className = "flex items-center gap-4",
  priority = false,
}: BrandLogoProps) {
  const content = (
    <>
      <Image
        src={logoImage}
        alt="JMO Media logo"
        width={size}
        height={size}
        priority={priority}
        className="shrink-0"
      />
      <span className={textClassName}>JMO Media</span>
    </>
  );

  return (
    <Link href={href} className={className} aria-label="JMO Media home">
      {content}
    </Link>
  );
}
