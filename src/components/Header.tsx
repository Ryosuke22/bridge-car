import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, Menu, X } from "lucide-react";
interface HeaderProps {
  onScrollToForm: () => void;
}
const Header = ({
  onScrollToForm
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl text-foreground md:text-2xl">車種限定買取 ブリッジ</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              当社の強み
            </a>
            <a href="#simulator" className="text-muted-foreground hover:text-foreground transition-colors">
              簡易査定
            </a>
            <Button variant="default" size="sm" onClick={onScrollToForm}>
              無料査定を申し込む
            </Button>
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
              <a href="#simulator" className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>
                簡易査定
              </a>
              <Button variant="default" onClick={() => {
            onScrollToForm();
            setIsMenuOpen(false);
          }}>
                無料査定を申し込む
              </Button>
            </div>
          </nav>}
      </div>
    </header>;
};
export default Header;