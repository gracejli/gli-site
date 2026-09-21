import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "grace li";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fontData = await readFile(join(process.cwd(), "fonts/Arimo-Regular.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 88px",
          background: "#6c000d",
          color: "#ff882d",
          fontFamily: "Arimo",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 88,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          grace li
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 32,
            lineHeight: 1.35,
            maxWidth: 920,
            opacity: 0.92,
          }}
        >
          tinkerer in los angeles, from a small town in michigan. welcome to my
          internet room.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Arimo",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
