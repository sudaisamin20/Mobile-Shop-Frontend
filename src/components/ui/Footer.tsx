const Footer = () => {
  return (
    <div>
       {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
 
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <span className="font-black text-lg">
                  <span className="text-yellow-400">Basit</span>
                  <span className="text-white"> Mobile </span>
                  <span className="text-purple-400">Zone</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Islamabad's most trusted mobile shop since 2016.
              </p>
              <div className="flex gap-3">
                {["📘", "📷", "💬"].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-colors"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
 
            {[
              { title: "Phones",  links: ["Apple iPhones", "Samsung Galaxy", "OnePlus", "Xiaomi", "Budget Phones"] },
              { title: "Services",links: ["Screen Repair", "Battery Replace", "Water Damage", "Trade-In"] },
              { title: "Company", links: ["About Us", "Contact", "Blog", "Privacy Policy"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
 
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2024 Basit Mobile Zone. All rights reserved.</p>
            <p className="text-gray-600 text-sm">Made with ❤️ in Islamabad, Pakistan 🇵🇰</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
