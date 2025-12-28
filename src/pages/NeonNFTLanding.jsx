import React, { useEffect, useRef, useState } from 'react';
// Ajout de FileText dans les imports lucide
import { Github, Linkedin, Mail, ExternalLink, MousePointer2, FileText } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const ModernPortfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const navWrapperRef = useRef(null);
  const aboutTextRef = useRef(null);
  const horizontalTriggerRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const bgTextRef = useRef(null);
  const experienceRef = useRef(null);

  const projects = [
    { title: "E-Commerce Luxe", category: "Web Design / Dev", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000", year: "2024" },
    { title: "Dashboard AI", category: "UI/UX Architecture", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000", year: "2023" },
    { title: "App Mobile Fitness", category: "React Native", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000", year: "2024" },
    { title: "Plateforme SaaS", category: "Fullstack", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000", year: "2023" },
  ];

  const experiences = [
  { 
    company: "Tech Studio", 
    role: "Développeur Senior", 
    period: "2023 - Présent", 
    desc: "Direction technique sur des projets React complexes et mentoring d'équipe." 
  },
  { 
    company: "Digital Agency", 
    role: "Fullstack Developer", 
    period: "2021 - 2023", 
    desc: "Développement d'architectures SaaS robustes avec Node.js et Next.js." 
  },
  { 
    company: "Freelance", 
    role: "Web Designer", 
    period: "2019 - 2021", 
    desc: "Création d'identités visuelles et de sites vitrines sur mesure pour clients internationaux." 
  },
  { 
    company: "Creative Hub", 
    role: "Junior Web Developer", 
    period: "2018 - 2019", 
    desc: "Intégration d'interfaces responsives et maintenance de solutions CMS." 
  }, 
  
];

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    if (progress === 100) {
      gsap.to(".loader-screen", {
        y: "-100%",
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => setLoading(false)
      });
    }
    

    return () => clearInterval(interval);
  }, [progress]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = id === 'hero-section' ? 0 : 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-line", { y: 100, skewY: 5, opacity: 0 });
      gsap.set(".nav-wrapper", { y: -120 });
      gsap.set(".scroll-indicator", { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(".nav-wrapper", { y: 0, duration: 1.2 })
        .to(".hero-line", { y: 0, skewY: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, "-=0.8")
        .from(".hero-card-inner", { scale: 1.1, duration: 2, ease: "expo.inOut" }, "-=1")
        .to(".scroll-indicator", { opacity: 1, scale: 1, duration: 1 }, "-=0.5");

      gsap.to(".scroll-line-inner", {
        y: "100%",
        repeat: -1,
        duration: 1.5,
        ease: "power2.inOut"
      });

      ScrollTrigger.create({
        start: "top top",
        end: 100,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const isMobile = window.innerWidth < 768;
          gsap.to(navWrapperRef.current, {
            maxWidth: isMobile ? "92%" : gsap.utils.interpolate(100, 80, p) + "%",
            marginTop: isMobile ? p * 12 : p * 24,
            padding: isMobile ? "12px 20px" : `${gsap.utils.interpolate(40, 16, p)}px ${gsap.utils.interpolate(48, 32, p)}px`,
            borderRadius: p * 50,
            backgroundColor: `rgba(255, 255, 255, ${p * 0.05})`,
            backdropFilter: `blur(${p * 20}px)`,
            border: `1px solid rgba(255, 255, 255, ${p * 0.1})`,
          });
        }
      });

      if (aboutTextRef.current) {
        gsap.from(aboutTextRef.current.querySelectorAll('.word'), {
          scrollTrigger: {
            trigger: aboutTextRef.current,
            start: "top 85%",
            end: "bottom 70%",
            scrub: 0.5,
          },
          opacity: 0.15,
          y: 10,
          stagger: 0.05,
        });
      }

      const pin = gsap.to(horizontalSectionRef.current, {
        x: "-300vw",
        ease: "none",
        scrollTrigger: {
          trigger: horizontalTriggerRef.current,
          pin: true,
          scrub: 1.2,
          end: () => `+=${horizontalTriggerRef.current.offsetWidth * 2}`,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(bgTextRef.current, {
        x: "-150vw",
        ease: "none",
        scrollTrigger: {
          trigger: horizontalTriggerRef.current,
          start: "top top",
          end: () => `+=${horizontalTriggerRef.current.offsetWidth * 2}`,
          scrub: 2.5,
        }
      });

        // Animation de la ligne verticale (elle s'allonge au scroll)
  gsap.fromTo(".experience-line", 
    { scaleY: 0, transformOrigin: "top" },
    { 
      scaleY: 1, 
      ease: "none",
      scrollTrigger: {
        trigger: "#experience-section",
        start: "top 40%",
        end: "bottom 80%",
        scrub: true
      }
    }
  );
  // --- ANIMATION EXPÉRIENCE ---
  // 1. Animation de la ligne verticale qui descend au scroll
  gsap.fromTo(".experience-line", 
    { scaleY: 0, transformOrigin: "top" },
    { 
      scaleY: 1, 
      ease: "none",
      scrollTrigger: {
        trigger: "#experience-section",
        start: "top 40%", // Commence quand la section arrive au milieu
        end: "bottom 80%",
        scrub: true // L'animation suit la vitesse du scroll
      }
    }
  );

  // 2. Animation d'entrée pour chaque carte et chaque point
  const cards = gsap.utils.toArray(".exp-card");
  cards.forEach((card) => {
    const dot = card.querySelector(".dot-center");
    const content = card.querySelector(".exp-content");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "top 50%",
        toggleActions: "play none none reverse",
      }
    });

    tl.from(dot, { scale: 0, duration: 0.4, ease: "back.out(2)" })
      .from(content, { 
        x: card.classList.contains('md:flex-row-reverse') ? 50 : -50, 
        opacity: 0, 
        duration: 0.8, 
        ease: "power3.out" 
      }, "-=0.2");
  });
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(menuRef.current, { clipPath: "circle(150% at 90% 10%)", duration: 1, ease: "expo.inOut" });
    } else {
      document.body.style.overflow = 'unset';
      gsap.to(menuRef.current, { clipPath: "circle(0% at 90% 10%)", duration: 0.8, ease: "expo.inOut" });
    }
  }, [isMenuOpen]);

  const splitText = (text) => text.split(" ").map((word, i) => (
    <span key={i} className="word inline-block mr-[0.25em]">{word}</span>
  ));

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* LOADER SCREEN */}
      <div className="loader-screen fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center">
          <div className="relative">
             <span className="text-8xl md:text-[12vw] font-black italic opacity-10 absolute -top-1/2 left-1/2 -translate-x-1/2">RMA</span>
             <div className="text-6xl md:text-8xl font-black tabular-nums">
               {progress}%
             </div>
          </div>
          <div className="w-48 h-[2px] bg-white/10 mt-4 overflow-hidden">
             <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[1000] flex justify-center px-4 md:px-6">
        <div ref={navWrapperRef} className="nav-wrapper w-full flex justify-between items-center py-6 md:py-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => scrollToSection(e, 'hero-section')}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-black">M</div>
            <span className="font-bold tracking-tighter uppercase hidden sm:block">Maminiela</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative z-[1001] w-10 h-10 flex flex-col items-center justify-center gap-1.5 group">
            <div className={`h-[2px] bg-white transition-all w-6 ${isMenuOpen ? 'rotate-45 translate-y-[4px] !bg-black' : ''}`} />
            <div className={`h-[2px] bg-white transition-all w-4 group-hover:w-6 ${isMenuOpen ? '-rotate-45 -translate-y-[4px] !bg-black w-6' : ''}`} />
          </button>
        </div>
      </nav>

    {/* MENU FULLSCREEN */}
{/* MENU FULLSCREEN MODIFIÉ */}
<div 
  ref={menuRef} 
  className="fixed inset-0 z-[950] flex flex-col justify-center items-center backdrop-blur-xl bg-[#1a1a1a]/95 text-white" 
  style={{ clipPath: "circle(0% at 90% 10%)" }}
>

  <div className="w-full max-w-sm px-10 relative z-10">
    <nav className="flex flex-col mb-10">
      {['Accueil', 'About', 'Projets', 'Expérience', 'Contact'].map((item, i) => (
        <a 
          key={item} 
          href={`#${item.toLowerCase()}`} 
          className="menu-item group flex items-center justify-between py-4 border-b border-white/5 hover:border-blue-500/30 transition-all duration-500"
          onClick={(e) => {
            let targetId = item === 'Accueil' ? 'hero-section' : 
                           item === 'About' ? 'about-section' : 
                           item === 'Projets' ? 'projects-trigger' : 
                           item === 'Expérience' ? 'experience-section' : 'footer-contact';
            scrollToSection(e, targetId);
          }}
        >
          <div className="flex items-center gap-4">
           <span className="text-[9px] font-mono text-gray-400 opacity-40">0{i + 1}</span>
            <span className="text-lg font-bold uppercase tracking-widest group-hover:italic group-hover:translate-x-3 transition-all duration-500">
              {item}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6] scale-0 group-hover:scale-100 transition-transform" />
        </a>
      ))}
    </nav>

    {/* Bouton CV */}
    <div className="menu-item flex justify-center">
      <a 
        href="/mon-cv.pdf" 
        download 
        className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] py-3.5 px-8 border border-white/10 rounded-full hover:bg-white hover:text-[#0a1128] transition-all duration-500"
      >
        <FileText size={12} />
        Télécharger CV
      </a>
    </div>
  </div>

  {/* Footer du menu */}
  <div className="menu-item absolute bottom-10 opacity-20 text-[8px] font-bold tracking-[0.4em] uppercase">
    Antananarivo / 2024
  </div>
</div>
      {/* HERO SECTION */}
      <section id="hero-section" className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="hero-card relative w-full max-w-6xl aspect-[4/5] md:aspect-[21/9] px-4">
          <div className="hero-card-inner relative w-full h-full rounded-[24px] md:rounded-[60px] overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-cover bg-center grayscale brightness-[0.2]" style={{ backgroundImage: `url('/portfolio_design.jpg')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent" />
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="hero-line block text-[10px] tracking-[0.6em] text-white/40 font-bold mb-4 uppercase">Maminiela Anthonio - Madagascar</span>
          <h1 className="hero-line text-6xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.85]">
            MAMINIELA<br /><span className="text-transparent outline-text italic">RMA</span>
          </h1>
        </div>

        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer" 
             onClick={(e) => scrollToSection(e, 'about-section')}>
          <div className="relative w-24 h-24 flex items-center justify-center animate-[spin_8s_linear_infinite]">
             <svg className="w-full h-full" viewBox="0 0 100 100">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                <text className="text-[10px] uppercase font-bold tracking-[2px] fill-white/20">
                   <textPath xlinkHref="#circlePath">Scroll Down • Scroll Down • Scroll Down • </textPath>
                </text>
             </svg>
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <MousePointer2 size={16} />
             </div>
          </div>
          <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
             <div className="scroll-line-inner absolute top-[-100%] left-0 w-full h-full bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about-section" className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-5xl">
          <span className="block text-[10px] tracking-[0.5em] text-white/30 mb-12 font-bold uppercase italic border-l-2 border-white/20 pl-4">Vision / 01</span>
          <h2 ref={aboutTextRef} className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight">
            {splitText("Je m’appelle Anthonio, développeur web passionné par le frontend et les nouvelles technologies. J’aime concevoir des interfaces élégantes, résoudre des problèmes et apprendre en continu. Mon objectif : créer des projets utiles, bien pensés et visuellement impactants.")}
          </h2>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <div id="projects-trigger" ref={horizontalTriggerRef} className="relative">
        <section className="overflow-hidden bg-[#0a0a0a]">
          <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
            <div ref={bgTextRef} className="flex whitespace-nowrap opacity-[0.05] blur-[10px]">
              <h2 className="text-[45vh] font-black uppercase tracking-tighter text-white">
                 {projects.map(p => `${p.title} • `).join("")} 
              </h2>
            </div>
          </div>

          <div ref={horizontalSectionRef} className="h-screen flex flex-row relative w-[400vw] z-10">
            {projects.map((project, index) => (
              <div key={index} className={`project-card-${index} w-screen h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-24 gap-12`}>
                <div className="relative w-full md:w-[50%] aspect-[16/10] overflow-hidden rounded-xl group shadow-2xl bg-[#111]">
                  <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                     <button className="p-5 bg-white rounded-full text-black transform scale-0 group-hover:scale-100 transition-transform">
                        <ExternalLink size={28} />
                     </button>
                  </div>
                </div>

                <div className={`content-${index} w-full md:w-1/3 text-white`}>
                  <div className="flex items-center gap-4 mb-4 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
                    <span>0{index + 1}</span>
                    <div className="h-[1px] w-8 bg-white/20"></div>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black uppercase leading-[0.8] mb-8 tracking-tighter">
                    {project.title.split(' ')[0]}<br/>
                    <span className="text-transparent outline-text italic">{project.title.split(' ')[1] || "Project"}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.category.split(' / ').map(t => (
                      <span key={t} className="text-[9px] border border-white/20 px-3 py-1 uppercase tracking-widest bg-white/5 font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed border-l-2 border-white/10 pl-6 italic">
                    Solution digitale optimisée pour une expérience utilisateur sans compromis.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    <section id="experience-section" className="min-h-screen py-32 px-6 md:px-24 bg-[#050505] relative">
  <div className="max-w-6xl mx-auto">
    <div className="mb-32">
        <span className="block text-[10px] tracking-[0.5em] text-white/30 mb-8 font-bold uppercase">Parcours / 02</span>
        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none italic">Expérience</h2>
    </div>

    <div className="relative">
      {/* Ligne verticale qui s'anime au scroll */}
      <div className="experience-line absolute left-0 md:left-1/2 top-0 w-[1px] h-full bg-gradient-to-b from-white via-white/20 to-transparent hidden md:block origin-top"></div>

      <div className="grid gap-32 relative">
        {experiences.map((exp, i) => (
          <div key={i} className={`exp-card flex flex-col md:flex-row items-start gap-8 md:gap-0 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Contenu Texte */}
            <div className={`exp-content w-full md:w-[45%] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <div className="text-white/20 font-mono text-xs mb-2">{exp.period}</div>
              <h4 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tighter hover:italic transition-all">{exp.company}</h4>
              <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-6">{exp.role}</p>
              <p className="text-white/60 text-sm leading-relaxed max-w-md ml-auto mr-0 inline-block italic border-t border-white/5 pt-4">
                {exp.desc}
              </p>
            </div>

            {/* Le point central sur la ligne */}
            <div className="dot-center absolute left-[-4px] md:left-1/2 md:translate-x-[-50%] w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 hidden md:block mt-4"></div>

            <div className="w-full md:w-[45%]"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
      <footer className="w-full py-16 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
        <div className="flex gap-8">
          {[Github, Linkedin, Mail].map((Icon, i) => (
            <a key={i} href="#" className="text-white/40 hover:text-white transition-all transform hover:-translate-y-1"><Icon size={20} /></a>
          ))}
        </div>
        <div className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">
          © 2024 RMA • Antananarivo, Madagascar
        </div>
      </footer>

      <style>{`
        .outline-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4); }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ModernPortfolio;