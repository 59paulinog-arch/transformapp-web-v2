import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'TransformApp — Vive tu verdadera historia',
  description: 'Un viaje de 8 etapas hacia la transformación real y duradera.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
