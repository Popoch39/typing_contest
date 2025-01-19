import { ThemeProvider } from "@/providers/theme-provider";
import "../globals.css";
export default function EmptyLayout({ children }: any) {
  return (
    <html lang="en" className="h-dvh w-dvw">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
