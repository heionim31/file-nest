import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export function Header() {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="container mx-auto flex items-center justify-between">
        <div>FileNest</div>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
