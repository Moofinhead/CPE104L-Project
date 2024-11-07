import Preloader from "@/layouts/Preloader";
import "@css/all-animations.css";
import "@css/animate.css";
import "@css/aos.css";
import "@css/bootstrap.min.css";
import "@css/default.css";
import "@css/fontawesome-all.min.css";
import "@css/jquery.fancybox.min.css";
import "@css/magnific-popup.min.css";
import "@css/meanmenu.css";
import "@css/nice-select.css";
import "@css/responsive.css";
import "@css/slick.css";
import "@css/style.css";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { CheckoutProvider } from '/contexts/CheckoutContext';

export const metadata = {
  title: "Filipinas Hotel Corporation (FHC)",
  description: "E aba potang ina",
}; //end metadata

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Preloader />
          <CheckoutProvider>
            {children}
          </CheckoutProvider>
        </body>
      </AuthProvider>
    </html>
  );
} //end page layout