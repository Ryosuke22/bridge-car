import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import headerLogo from "@/assets/header-logo.png";
interface HeaderProps {
  onScrollToForm: () => void;
}
const Header = ({
  onScrollToForm
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    isAdmin,
    signOut
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    toast.success('ログアウトしました');
  };
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center -ml-2">
            <img src={headerLogo} alt="車種限定買取のブリッジ" className="h-12 w-auto object-contain" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              当社の強み
            </a>
            <Button variant="default" size="sm" onClick={onScrollToForm}>
              無料査定を申し込む
            </Button>
            
            {user ? (
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-accent hover:text-accent">
                  <Shield className="h-4 w-4 mr-1" />
                  管理者ログアウト
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-1" />
                    管理者
                  </Button>
                </Link>
              )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>
                当社の強み
              </a>
              <Button variant="default" onClick={() => {
            onScrollToForm();
            setIsMenuOpen(false);
          }}>
                無料査定を申し込む
              </Button>
              
              {user ? (
                <Button variant="ghost" size="sm" onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-accent hover:text-accent">
                  <Shield className="h-4 w-4 mr-1" />
                  管理者ログアウト
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-1" />
                    管理者
                  </Button>
                </Link>
              )}
            </div>
          </nav>}
      </div>
    </header>;
};
export default Header;