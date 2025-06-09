import SignupForm from "@/components/auth/signup-form";
import Logo from "@/components/icons/logo";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary/10 p-4">
       <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <SignupForm />
    </div>
  );
}
