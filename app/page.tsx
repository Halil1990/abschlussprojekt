'use client';

import { useEffect } from 'react';
import Hero from '../components/Hero';
import ProductionGallery from '../components/ProductionGallery';
import ContactForm from '../components/ContactForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import About from '../components/About';
import Veredelung from '../components/Veredelung';
import Partners from '../components/Partners';

export default function Page() {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <div className="relative bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10">
          <ProductionGallery />
          <Veredelung />
          <Partners />
          <ContactForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
