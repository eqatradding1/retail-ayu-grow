
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, User, Settings, LogOut } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  
  // Get user's first initial or "U" if no user
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-white shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-purple-100"
          onClick={onMenuClick}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        <h1 className="hidden md:block text-lg font-semibold ml-4 text-purple-900">
          RetailAyu Wholesale Management
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-100">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                {userInitial}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/profile" className="flex w-full items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/settings" className="flex w-full items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer text-red-600 focus:text-red-500"
              onClick={() => signOut && signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
