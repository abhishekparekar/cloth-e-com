import React from "react";
import { Instagram, Heart } from "lucide-react";
import { STORE_CONFIG } from "../../utils/constants";

export const InstagramLookbook = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
      handle: "@ananya_couture",
      likes: "1.4k",
    },
    {
      url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80",
      handle: "@sharma_diaries",
      likes: "940",
    },
    {
      url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
      handle: "@pooja_festive",
      likes: "2.1k",
    },
    {
      url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
      handle: "@mira_style",
      likes: "870",
    },
    {
      url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80",
      handle: "@ritu_couture",
      likes: "1.8k",
    },
    {
      url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
      handle: "@aanya_muse",
      likes: "3.2k",
    },
  ];

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">
            Visual Journal
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-plum tracking-tight">
            Follow Our Lookbook
          </h2>
        </div>
        <a
          href={STORE_CONFIG.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <Instagram className="w-4 h-4" />
          @AanyaBoutiqueOfficial
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {images.map((item, index) => (
          <a
            key={index}
            href={STORE_CONFIG.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-3xl overflow-hidden bg-ivory shadow-xs"
          >
            <img
              src={item.url}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-plum/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-2">
              <Instagram className="w-5 h-5 mb-1 text-gold-light" />
              <span className="text-[10px] font-semibold">{item.handle}</span>
              <span className="flex items-center gap-1 text-[10px] text-primary-light mt-1 font-bold">
                <Heart className="w-3 h-3 fill-primary-light" />
                {item.likes}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
