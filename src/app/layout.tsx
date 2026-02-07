import type { Metadata } from "next";
import "frosted-ui/styles.css";
import { Theme } from "frosted-ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whop Partner Directory",
  description:
    "Find the perfect partner to grow your Whop. Browse vetted agencies, specialists, and tools trusted by the top Whop creators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Theme
          appearance="dark"
          accentColor="orange"
          grayColor="sand"
          radius="medium"
          scaling="100%"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
