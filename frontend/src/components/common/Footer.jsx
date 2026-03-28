import { Link } from "react-router-dom";
import { GiIndianPalace } from "react-icons/gi";
import { FiInstagram, FiYoutube, FiTwitter } from "react-icons/fi";

const REGIONS = [
  { id: "madhya_pradesh", name: "Madhya Pradesh" },
  { id: "rajasthan",      name: "Rajasthan"      },
  { id: "punjab",         name: "Punjab"         },
  { id: "kerala",         name: "Kerala"         },
  { id: "gujarat",        name: "Gujarat"        },
];

const FESTIVALS = [
  { id: "diwali",    name: "🪔 Diwali Sweets"      },
  { id: "holi",      name: "🎨 Holi Treats"        },
  { id: "pongal",    name: "🌾 Pongal Feast"       },
  { id: "eid",       name: "🌙 Eid Specials"       },
  { id: "navratri",  name: "🕯️ Navratri Vrat"     },
];

export default function Footer() {
  return (
    <footer className="bg-earth-900 text-earth-200 mt-20">
      {/* Quote banner */}
      <div className="bg-spice-700 py-5 px-4 text-center">
        <p className="font-hindi text-white text-xl">
          "जहाँ मिट्टी की खुशबू हो, वहीं असली स्वाद मिलता है।"
        </p>
        <p className="text-spice-200 text-sm mt-1">
          Where the fragrance of earth lives, there you find real flavour.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-spice-600 rounded-xl flex items-center justify-center">
                <GiIndianPalace className="text-white text-xl" />
              </div>
              <div>
                <div className="font-hindi text-white text-base">मिट्टी का स्वाद</div>
                <div className="text-[10px] text-earth-400 tracking-widest uppercase">Mitti Ka Swad</div>
              </div>
            </div>
            <p className="text-sm text-earth-400 leading-relaxed mb-4">
              Preserving India's culinary heritage. Connecting you to authentic traditional food and its stories — one bite at a time.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiYoutube, FiTwitter].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-earth-800 hover:bg-spice-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Explore Regions</h4>
            <ul className="space-y-2">
              {REGIONS.map((r) => (
                <li key={r.id}>
                  <Link to={`/region/${r.id}`}
                    className="text-sm text-earth-400 hover:text-spice-300 transition-colors">
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Festivals */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Festival Foods</h4>
            <ul className="space-y-2">
              {FESTIVALS.map((f) => (
                <li key={f.id}>
                  <Link to={`/festival/${f.id}`}
                    className="text-sm text-earth-400 hover:text-turmeric-400 transition-colors">
                    {f.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Stories & More</h4>
            <ul className="space-y-2">
              {[
                ["/stories?type=grandma_recipe", "Grandma Recipes"],
                ["/stories?type=village_special", "Village Specials"],
                ["/stories?type=food_story", "Food Stories"],
                ["/register?role=vendor", "Become a Vendor"],
                ["/foods", "All Heritage Dishes"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-earth-400 hover:text-spice-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-earth-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-earth-500">© 2024 Mitti Ka Swad. All rights reserved.</p>
          <p className="text-xs text-earth-500">Made with ❤️ for Bharat's culinary heritage</p>
        </div>
      </div>
    </footer>
  );
}