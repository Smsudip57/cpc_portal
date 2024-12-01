import { ThemeProvider } from "@/context/context";
import "./globals.css";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <body className="bg-white">
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
