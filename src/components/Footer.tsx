// src/components/Footer.tsx

/**
 * The shared Footer component for the website.
 * It displays the copyright notice with the current year.
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm opacity-80">© {currentYear} Personalized Content Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}