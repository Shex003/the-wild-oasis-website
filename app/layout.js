import Navigation from "./_component/Navigation";
import Logo from "./_component/Logo";
import "@/app/_styles/globals.css";
import { Josefin_Sans } from "next/font/google";

const Josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  // title: "The Wild Oasis",
  title: {
    template: "%s / The Wild Oasis",
    default: "Welcome / The Wild Oasis",
  },
  description:
    "Luxurious cabins hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forest.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${Josefin.className} bg-primary-950 text-primary-100 min-h-screen`}
      >
        <header>
          <Logo />
        </header>
        <Navigation />
        {children}
        <footer>Copyright by the wild oasis</footer>
      </body>
    </html>
  );
}
