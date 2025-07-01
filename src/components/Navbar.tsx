import StravaLoginButton from "@/src/components/StravaLoginButton";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-orange-500 text-white">
      <div className="text-lg font-bold">Frava</div>
      <StravaLoginButton />
    </nav>
  );
}
