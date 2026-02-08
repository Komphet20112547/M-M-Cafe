export function Footer() {
  return (
    <footer className="border-t-2 border-border/50 bg-background/90 backdrop-blur-xl mt-auto">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          <div className="fade-in">
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 gradient-text">🐾 Pet Cafe</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              ร้านคาเฟ่ที่มีสัตว์เลี้ยงน่ารัก พร้อมอาหารและเครื่องดื่มอร่อย
            </p>
          </div>
          <div className="fade-in" style={{ animationDelay: '100ms' }}>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-primary">ลิงก์</h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm md:text-base text-muted-foreground">
              <li>
                <a href="/menu" className="hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block hover:font-medium">
                  เมนู
                </a>
              </li>
              <li>
                <a href="/pets" className="hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block hover:font-medium">
                  สัตว์เลี้ยง
                </a>
              </li>
              <li>
                <a href="/promotions" className="hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block hover:font-medium">
                  โปรโมชั่น
                </a>
              </li>
              <li>
                <a href="/reviews" className="hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block hover:font-medium">
                  รีวิว
                </a>
              </li>
            </ul>
          </div>
          <div className="fade-in" style={{ animationDelay: '200ms' }}>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-primary">ติดต่อเรา</h4>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Email: info@petcafe.com
              <br />
              Tel: 02-123-4567
            </p>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 md:mt-10 pt-6 sm:pt-8 border-t-2 border-border/50 text-center text-xs sm:text-sm md:text-base text-muted-foreground">
          © {new Date().getFullYear()} Pet Cafe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
