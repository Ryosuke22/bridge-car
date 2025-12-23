import { Mail, Phone, MapPin } from "lucide-react";
import headerLogo from "@/assets/header-logo.png";
import mtbLogo from "@/assets/mtb-logo-transparent.png";
const Footer = () => {
  return <footer className="py-12 bg-background border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4 -ml-4">
              <img src={headerLogo} alt="車種限定買取のブリッジ" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-muted-foreground">
              輸出向け中古車・バイク専門の買取サービス。他社で0円査定された車両も適正価格で買取します。
            </p>
          </div>

          <div>
            <h3 className="font-sans text-xl font-medium mb-4 text-foreground">買取対象</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 初年度登録が平成12年以前のもの</li>
              <li>
            </li>
            </ul>
          </div>

          <div className="md:flex md:flex-col md:items-end">
            <div>
              <h3 className="font-sans text-xl font-medium mb-4 text-foreground">お問い合わせ</h3>
              <img src={mtbLogo} alt="合同会社MTB" className="h-4 w-auto object-contain mb-3" />
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>info@bridge-car.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>090-1195-2836</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>愛知県豊橋市雲谷町</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 text-center text-sm text-muted-foreground space-y-2">
          <p>古物商許可番号：愛知県公安委員会 第543952211300号</p>
          <p>© 2024 Export Buyers. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;