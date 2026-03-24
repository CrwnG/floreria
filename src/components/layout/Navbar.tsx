'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { MobileMenu } from './MobileMenu';

const navLinks = [
  { label: 'Flores', href: '/categoria/flores' },
  { label: 'Globos', href: '/categoria/globos' },
  { label: 'Regalos', href: '/categoria/regalos' },
  { label: 'Ocasiones', href: '/#ocasiones' },
  { label: 'Nuestra Historia', href: '/#historia' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.cantidad, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm'
            : 'bg-white'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-fiorella-charcoal cursor-pointer"
              aria-label="Menú"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl md:text-3xl text-fiorella-charcoal tracking-tight">
                Fiorella
              </span>
              <span className="text-fiorella-gold text-xs uppercase tracking-widest font-medium hidden sm:block">
                Balloons
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm uppercase tracking-wider text-fiorella-charcoal hover:text-fiorella-gold transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fiorella-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button className="text-fiorella-charcoal hover:text-fiorella-gold transition-colors hidden sm:block cursor-pointer" aria-label="Buscar">
                <Search size={20} />
              </button>
              <Link
                href="/favoritos"
                className="text-fiorella-charcoal hover:text-fiorella-gold transition-colors hidden sm:block relative"
                aria-label="Favoritos"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-fiorella-rose-deep text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleCart}
                className="text-fiorella-charcoal hover:text-fiorella-gold transition-colors relative cursor-pointer"
                aria-label="Carrito"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-fiorella-rose-deep text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
