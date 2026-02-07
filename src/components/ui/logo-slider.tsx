"use client";

import Image from "next/image";

const LOGO_SRC = "/Partner_logos_slider/salesmomentum.png";
const LOGO_COUNT = 12;
const LOGO_HEIGHT = 128;
const GAP_PX = 30;

export function LogoSlider() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0px, black 90px, black calc(100% - 90px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0px, black 90px, black calc(100% - 90px), transparent 100%)",
      }}
    >
      <div
        className="flex items-center"
        style={{
          gap: GAP_PX,
          width: "max-content",
          animation: "logo-slider-scroll 30s linear infinite",
        }}
      >
        {Array.from({ length: LOGO_COUNT * 2 }, (_, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center justify-center"
            style={{ width: LOGO_HEIGHT + GAP_PX }}
          >
            <Image
              src={LOGO_SRC}
              alt="Partner logo"
              width={LOGO_HEIGHT * 2}
              height={LOGO_HEIGHT}
              className="w-auto object-contain"
              style={{ height: LOGO_HEIGHT }}
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
