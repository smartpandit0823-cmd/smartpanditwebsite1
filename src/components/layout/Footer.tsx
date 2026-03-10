import Link from "next/link";
import { Instagram, Youtube, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#FEFAF4] pt-16 border-t border-orange-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">

          {/* Section 1: Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="SanatanSetu" className="h-10 w-auto" />
            </Link>
            <p className="text-[#888888] text-[15px] font-medium leading-relaxed max-w-xs">
              India&apos;s most trusted spiritual destination. Premium spiritual tools, energized by experts and delivered pan India.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/sanatansetu" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-[#FF8C00] hover:bg-[#FF8C00] hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com/@sanatansetu" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-[#FF8C00] hover:bg-[#FF8C00] hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://wa.me/919022462127" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-[#FF8C00] hover:bg-[#FF8C00] hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[#1A1A1A] text-xl mb-2 font-heading">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Home</Link></li>
              <li><Link href="/shop" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Shop</Link></li>
              <li><Link href="/shop?combos=true" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Combos</Link></li>
              <li><Link href="/blog" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Blog</Link></li>
              <li><Link href="/about" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">About Us</Link></li>
            </ul>
          </div>

          {/* Section 3: Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[#1A1A1A] text-xl mb-2 font-heading">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/shop?category=bracelets" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Bracelets</Link></li>
              <li><Link href="/shop?category=rudraksha" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Rudraksha</Link></li>
              <li><Link href="/shop?category=yantras" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Yantras</Link></li>
              <li><Link href="/shop?category=gemstones" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Gemstones</Link></li>
              <li><Link href="/shop?category=vastu" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Vastu</Link></li>
            </ul>
          </div>

          {/* Section 4: Trust */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[#1A1A1A] text-xl mb-2 font-heading">Trust & Support</h3>
            <ul className="space-y-3">
              <li><Link href="/certificates" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Lab Certificate</Link></li>
              <li><Link href="/return-policy" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Return Policy</Link></li>
              <li><Link href="/shipping-info" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Shipping Info</Link></li>
              <li><Link href="/privacy" className="text-[#888888] hover:text-[#FF8C00] font-medium text-[15px]">Privacy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 pb-12 md:pb-8 border-t border-orange-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#888888] font-medium text-center md:text-left">
            © 2026 SanatanSetu | GST: 27AXXXXXXXXXX1Z | Made with <span className="text-[#FF8C00] mx-1">🙏</span> in India
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
