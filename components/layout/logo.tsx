import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  variant?: "light" | "dark"
}

export function Logo({ variant = "light" }: LogoProps) {
  const logoSrc = variant === "light" ? "/images/logo.png" : "/images/dark-logo.png"

  return (
    <Link href="/" className="flex items-center">
      <Image src={logoSrc || "/placeholder.svg"} alt="Geração Eleita" width={150} height={40} priority />
    </Link>
  )
}
