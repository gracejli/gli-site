"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "grace li", href: "/" }, 
  { name: "blog", href: "/blog" }, 
  { name: "work", href: "/work" }, 
  // { name: "all", href: "/all" }, 
];

// const navItems = [
//   { name: "grace li", href: "/" }, 
//   { name: "blog", href: "/blog" },
// ];

/*  { name: "my projects", href: "/projects" },
  { name: "awesome links", href: "/links" },*/

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4 text-md font-rasterGrotesk">
      <ul className="flex flex-col gap-3">
        {navItems.map((item) => {
          // Check if this link is currently active
          const isActive = pathname === item.href;

          return (
            <li key={item.href} className="relative w-fit">
              {isActive && (
                <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                  <span className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] text">
                    ::
                  </span>
                </div>
              )}
              <Link
                href={item.href}
                className={`underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]
                  ${
                    isActive
                      ? "border-[#e6dfa8]" // Active colors
                      : "border-[#e6dfa8]" // Default colors (same as active in your design)
                  }
                `}
              >
                {item.name}
              </Link>
              
            </li>
            
          );
        })}
      </ul>
    </nav>
  );
}

// import Link from "next/link";

// // NAVIGATION BAR/COMPONENT

// export default function Nav() {
//   return (
//     <nav className="flex flex-col gap-2">
//       <Link className="underline underline-offset-4 font-rasterGrotesk font-lg 
//       transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]" href="/">
//         grace li
//       </Link>
//       <Link className="underline underline-offset-4 font-rasterGrotesk
//       transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]" href="/blog">
//         blog
//       </Link>
//     </nav>
//   );
// }