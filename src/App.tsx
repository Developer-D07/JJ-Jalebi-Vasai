import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ShoppingBag,
  MapPin,
  Phone,
  MessageCircle,
  ChevronRight,
  Star,
  X,
} from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_path: string;
  calories: number;
}

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch menu:", err);
        setLoading(false);
      });
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const cartTotal = cart.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-charcoal-900 text-gray-200 font-sans selection:bg-saffron-500 selection:text-charcoal-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-charcoal-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-wider text-saffron-500">
                JJ JALEBI
              </span>
              <span className="text-xs tracking-widest uppercase text-gray-400 mt-1">
                Vasai
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#menu"
                className="text-sm font-medium hover:text-saffron-400 transition-colors hidden sm:block"
              >
                Menu
              </a>
              <a
                href="#about"
                className="text-sm font-medium hover:text-saffron-400 transition-colors hidden sm:block"
              >
                Heritage
              </a>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="relative p-2 text-gray-300 hover:text-saffron-500 transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-charcoal-900 transform translate-x-1/4 -translate-y-1/4 bg-saffron-500 rounded-full">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-charcoal-900">
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-transparent to-charcoal-900/80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-saffron-500/30 bg-saffron-500/10 text-saffron-400 text-xs font-medium tracking-widest uppercase mb-6">
              <Star className="w-3 h-3 fill-current" />
              <span>1947 Vasai</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
              The Golden <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-gold-600 italic font-light">
                Heritage
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the authentic taste of pure desi ghee jalebis, crafted
              with generations of tradition and a touch of saffron magic.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#menu"
                className="px-8 py-4 bg-saffron-500 hover:bg-saffron-400 text-charcoal-900 font-semibold rounded-none tracking-wide transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                EXPLORE MENU <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/918805262022?text=Hi%20JJ%20Jalebi,%20I%20want%20to%20place%20an%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 hover:border-saffron-500 hover:text-saffron-400 text-white font-medium rounded-none tracking-wide transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-4 h-4" /> ORDER VIA WHATSAPP
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Heritage Section */}
      <section id="about" className="py-24 bg-charcoal-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Our Heritage
            </h2>
            <div className="w-16 h-1 bg-saffron-500 rounded-full mb-8 mx-auto"></div>
            <p className="text-gray-300 text-lg font-light leading-relaxed mb-6">
              Since 1947, JJ Jalebi has been a cornerstone of Vasai's culinary landscape. What started as a small family endeavor has blossomed into a beloved local institution, renowned for our uncompromising commitment to quality and tradition.
            </p>
            <p className="text-gray-400 font-light leading-relaxed mb-8">
              Every jalebi is crafted using our secret family recipe, fried to golden perfection in pure desi ghee, and soaked in saffron-infused syrup. We don't just make sweets; we preserve a legacy of flavor that brings families together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-charcoal-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              Our Offerings
            </h2>
            <div className="w-16 h-1 bg-saffron-500 mx-auto rounded-full"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-charcoal-700 border-t-saffron-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-charcoal-800 border border-white/5 hover:border-saffron-500/30 transition-all duration-500 overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-medium tracking-widest text-gray-500 uppercase">
                        {item.category}
                      </div>
                      <div className="text-saffron-400 text-sm font-medium">
                        Rs. {item.price} / 250g
                      </div>
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-white mb-3 group-hover:text-saffron-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow font-light">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mb-6 text-xs text-gray-500 font-medium tracking-wide">
                      <span className="inline-block w-1 h-1 rounded-full bg-saffron-500/50"></span>
                      {item.calories} kcal / serving
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full py-3 border border-white/10 hover:border-saffron-500 hover:bg-saffron-500 hover:text-charcoal-900 text-white font-medium tracking-wide transition-all duration-300 text-sm uppercase"
                    >
                      Add to Order
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-950 border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-saffron-500 block mb-4">
                JJ JALEBI
              </span>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
                Serving the finest, crispiest, and most authentic jalebis in
                Vasai since 1947. A legacy of sweetness.
              </p>
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold mb-4 text-lg">
                Visit Us
              </h4>
              <ul className="space-y-3 text-sm text-gray-400 font-light">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-saffron-500 shrink-0" />
                  <span>
                    Shop No. 7, Muslim Community Building,
                    <br />
                    Dindyal Nagar, Vasai West - 401202
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-saffron-500 shrink-0" />
                  <a
                    href="tel:+918805262022"
                    className="hover:text-saffron-400 transition-colors"
                  >
                    +91 88052 62022
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold mb-4 text-lg">
                Hours
              </h4>
              <ul className="space-y-2 text-sm text-gray-400 font-light">
                <li className="flex justify-between">
                  <span>Monday - Friday</span> <span>12:00 PM - 11:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday - Sunday</span> <span>11:00 AM - 12:00 AM</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs font-light">
              &copy; {new Date().getFullYear()} JJ Jalebi Vasai. All rights
              reserved.
            </p>
            <div className="text-gray-500 text-xs font-light">
              Designed with â¥ in Vasai
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918805262022?text=Hi%20JJ%20Jalebi,%20I%20want%20to%20place%20an%20order"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Order Modal */}
      {isOrderModalOpen && (
        <OrderModal
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setIsOrderModalOpen(false)}
          removeFromCart={removeFromCart}
          clearCart={() => setCart([])}
        />
      )}

    </div>
  );
}

function OrderModal({
  cart,
  cartTotal,
  onClose,
  removeFromCart,
  clearCart,
}: {
  cart: { item: MenuItem; quantity: number }[];
  cartTotal: number;
  onClose: () => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          order_details: cart,
          total_amount: cartTotal,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 3000);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try WhatsApp ordering.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-charcoal-900 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-charcoal-900/95 backdrop-blur z-10">
          <h2 className="text-2xl font-serif font-bold text-white">
            Your Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 flex-grow">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-saffron-500/20 text-saffron-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">
                Order Confirmed!
              </h3>
              <p className="text-gray-400 font-light">
                Thank you for choosing JJ Jalebi. We will contact you shortly.
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-light">
              Your bag is empty. Add some delicious sweets!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium tracking-widest text-gray-500 uppercase mb-4 border-b border-white/5 pb-2">
                  Order Summary
                </h3>
                <ul className="space-y-4 mb-6">
                  {cart.map(({ item, quantity }) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-start text-sm"
                    >
                      <div>
                        <span className="text-white">{item.name}</span>
                        <div className="text-gray-500 text-xs mt-1">
                          Qty: {quantity} x Rs. {item.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-saffron-400 font-medium">
                          Rs. {item.price * quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-600 hover:text-red-400"
                        >
                          &times;
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-xl font-serif text-saffron-500 font-bold">
                    Rs. {cartTotal}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium tracking-widest text-gray-500 uppercase mb-4 border-b border-white/5 pb-2">
                  Delivery Details
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-charcoal-800 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-saffron-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-charcoal-800 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-saffron-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Delivery Address (Vasai Only)
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full bg-charcoal-800 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-saffron-500 transition-colors text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-saffron-500 hover:bg-saffron-400 text-charcoal-900 font-semibold tracking-wide transition-colors mt-4 disabled:opacity-50"
                  >
                    {submitting ? "PROCESSING..." : "CONFIRM ORDER"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
