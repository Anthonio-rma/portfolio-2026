import React, { useEffect, useRef, useState } from 'react';
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
  const videoRef = useRef(null);

  const projects = [
    { title: "PORTFOLIO", category: "Web Design / Dev", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000", year: "2024" },
    { title: "Dashboard AI", category: "UI/UX Architecture", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000", year: "2023" },
    { title: "App Mobile Fitness", category: "React Native", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000", year: "2024" },
    { title: "Plateforme SaaS", category: "Fullstack", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000", year: "2023" },
  ];

  const experiences = [
    { company: "1ème HACKATHON", role: "Création site web", period: "Desembre_2024 (INSI)", desc: "site web pour mètre en valeur Madagasikara, travailler en équipe" },
    { company: "2ème HACKATHON", role: "Création site web et mobile", period: "Nov_2024(INSI)", desc: "Conception web et mobile multiplateforme en environnement collaboratif." },
    { company: "DEVFEST", role: "Création site web ", period: "Octobre_2025", desc: "Une web sur le thème de IA" },
    { company: "Creative Hub", role: "Junior Web Developer", period: "2018 - 2019", desc: "Intégration d'interfaces responsives et maintenance de solutions CMS." }, 
  ];

  // Loader Logic
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
      // Hero Animations
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

      // Navbar Scroll Effect
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

      // About Text Animation
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

      // --- ULTRA SMOOTH VIDEO SCRUBBING & HORIZONTAL SCROLL ---
      const video = videoRef.current;
      
      // On s'assure que la vidéo est prête
      const initVideoScrub = () => {
        if (!video) return;

        const scrollDuration = horizontalTriggerRef.current.offsetWidth * 2;

        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: horizontalTriggerRef.current,
            pin: true,
            scrub: 1, // Lissage du scroll horizontal
            end: () => `+=${scrollDuration}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Calcul du temps cible de la vidéo basé sur le scroll
              if (video.duration) {
                const targetTime = self.progress * video.duration;
                // Animation fluide du currentTime (évite les saccades)
                gsap.to(video, {
                  currentTime: targetTime,
                  duration: 0.4, 
                  ease: "power1.out",
                  overwrite: "auto"
                });
              }
            }
          }
        });

        mainTl.to(horizontalSectionRef.current, {
          x: "-300vw",
          ease: "none",
        });

        // Background Text Parallax
        gsap.to(bgTextRef.current, {
          x: "-150vw",
          ease: "none",
          scrollTrigger: {
            trigger: horizontalTriggerRef.current,
            start: "top top",
            end: () => `+=${scrollDuration}`,
            scrub: 2,
          }
        });
      };

      // Attendre que les métadonnées de la vidéo soient chargées
      if (video) {
        if (video.readyState >= 1) {
          initVideoScrub();
        } else {
          video.addEventListener('loadedmetadata', initVideoScrub);
        }
      }

      // Experience Section
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
             <div className="text-6xl md:text-8xl font-black tabular-nums">{progress}%</div>
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
      <div ref={menuRef} className="fixed inset-0 z-[950] flex flex-col justify-center items-center backdrop-blur-xl bg-[#1a1a1a]/95 text-white" style={{ clipPath: "circle(0% at 90% 10%)" }}>
        <div className="w-full max-w-sm px-10 relative z-10">
          <nav className="flex flex-col mb-10">
            {['Accueil', 'About', 'Projets', 'Expérience', 'Contact'].map((item, i) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="menu-item group flex items-center justify-between py-4 border-b border-white/5 hover:border-blue-500/30 transition-all duration-500"
                onClick={(e) => {
                  let targetId = item === 'Accueil' ? 'hero-section' : item === 'About' ? 'about-section' : item === 'Projets' ? 'projects-trigger' : item === 'Expérience' ? 'experience-section' : 'footer-contact';
                  scrollToSection(e, targetId);
                }}>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-mono text-gray-400 opacity-40">0{i + 1}</span>
                  <span className="text-lg font-bold uppercase tracking-widest group-hover:italic group-hover:translate-x-3 transition-all duration-500">{item}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6] scale-0 group-hover:scale-100 transition-transform" />
              </a>
            ))}
          </nav>
          <div className="menu-item flex justify-center">
            <a href="/mon-cv.pdf" download className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] py-3.5 px-8 border border-white/10 rounded-full hover:bg-white hover:text-[#0a1128] transition-all duration-500">
              <FileText size={12} /> Télécharger CV
            </a>
          </div>
        </div>
        <div className="menu-item absolute bottom-10 opacity-20 text-[8px] font-bold tracking-[0.4em] uppercase">Antananarivo / 2024</div>
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
          <h1 className="hero-line text-6xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.85]">MAMINIELA<br /><span className="text-transparent outline-text italic">RMA</span></h1>
        </div>
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer" onClick={(e) => scrollToSection(e, 'about-section')}>
          <div className="relative w-24 h-24 flex items-center justify-center animate-[spin_8s_linear_infinite]">
             <svg className="w-full h-full" viewBox="0 0 100 100">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                <text className="text-[10px] uppercase font-bold tracking-[2px] fill-white/20">
                   <textPath xlinkHref="#circlePath">Scroll Down • Scroll Down • Scroll Down • </textPath>
                </text>
             </svg>
             <div className="absolute inset-0 flex items-center justify-center opacity-20"><MousePointer2 size={16} /></div>
          </div>
          <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
             <div className="scroll-line-inner absolute top-[-100%] left-0 w-full h-full bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about-section" className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-5xl">
          <span className="block text-[10px] tracking-[0.5em] text-white/30 mb-12 font-bold uppercase italic border-l-2 border-white/20 pl-4">A propos de moi </span>
          <h2 ref={aboutTextRef} className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight">
            {splitText("Je m’appelle Anthonio, développeur web passionné par le frontend et les nouvelles technologies. J’aime concevoir des interfaces élégantes, résoudre des problèmes et apprendre en continu. Mon objectif : créer des projets utiles, bien pensés et visuellement impactants.")}
          </h2>
        </div>
      </section>

      {/* PROJECTS SECTION WITH SMOOTH VIDEO SCRUBBING */}
      <div id="projects-trigger" ref={horizontalTriggerRef} className="relative">
        <section className="overflow-hidden bg-[#0a0a0a]">
          
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-black/60 z-10" /> 
            <video 
              ref={videoRef}
              muted 
              playsInline 
              preload="auto"
              className="w-full h-full object-cover grayscale opacity-40"
              style={{ pointerEvents: 'none' }}
            >
             <source src="/video/video_fluide.mp4" type="video/mp4" />
            </video>
          </div>

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
                      <span key={t} className="text-[9px] border border-white/20 px-3 py-1 uppercase tracking-widest bg-white/5 font-bold">{t}</span>
                    ))}
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed border-l-2 border-white/10 pl-6 italic">portfolio stylé avec une interface modère, mise à jour</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* EXPERIENCE SECTION */}
      <section id="experience-section" className="min-h-screen py-32 px-6 md:px-24 bg-[#050505] relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-32">
              <span className="block text-[10px] tracking-[0.5em] text-white/30 mb-8 font-bold uppercase">Parcours</span>
              <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none italic">Expérience</h2>
          </div>
          <div className="relative">
            <div className="experience-line absolute left-0 md:left-1/2 top-0 w-[1px] h-full bg-gradient-to-b from-white via-white/20 to-transparent hidden md:block origin-top"></div>
            <div className="grid gap-32 relative">
              {experiences.map((exp, i) => (
                <div key={i} className={`exp-card flex flex-col md:flex-row items-start gap-8 md:gap-0 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`exp-content w-full md:w-[45%] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="text-white/20 font-mono text-xs mb-2">{exp.period}</div>
                    <h4 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tighter hover:italic transition-all">{exp.company}</h4>
                    <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-6">{exp.role}</p>
                    <p className="text-white/60 text-sm leading-relaxed max-w-md ml-auto mr-0 inline-block italic border-t border-white/5 pt-4">{exp.desc}</p>
                  </div>
                  <div className="dot-center absolute left-[-4px] md:left-1/2 md:translate-x-[-50%] w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 hidden md:block mt-4"></div>
                  <div className="w-full md:w-[45%]"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
        
      {/* FOOTER */}
      <footer id="footer-contact" className="w-full pt-32 pb-12 px-6 md:px-20 border-t border-white/5 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col gap-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-8">
                <span className="inline-block text-[10px] tracking-[0.5em] text-blue-500 mb-8 font-black uppercase py-2 px-4 border border-blue-500/20 rounded-full bg-blue-500/5">Besoin d'un expert ?</span>
                <a href="mailto:votre@email.com" className="group block">
                  <h2 className="text-[12vw] lg:text-[7vw] font-black uppercase tracking-tighter leading-[0.85] text-white transition-all duration-700">Parlons de votre <br /><span className="text-transparent outline-text group-hover:text-blue-500 transition-all duration-700 italic">Prochain Projet</span></h2>
                  <div className="h-[1px] w-0 bg-blue-500 group-hover:w-full transition-all duration-1000 ease-in-out mt-4" />
                </a>
              </div>
              <div className="lg:col-span-4 flex flex-col md:items-end gap-10">
                <button onClick={(e) => scrollToSection(e, 'hero-section')} className="group relative flex items-center justify-center w-24 h-24 rounded-full border border-white/10 hover:border-blue-500 transition-all duration-500 bg-white/5 hover:bg-blue-500">
                  <div className="flex flex-col items-center group-hover:-translate-y-1 transition-transform duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Top</span>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:scale-125 transition-transform">
                      <path d="M7.5 2V13M7.5 2L3 6.5M7.5 2L12 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-16 border-y border-white/5">
              <div className="space-y-4">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">Localisation</p>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold text-white/80 uppercase">Antananarivo, MG</p>
                  <p className="text-sm font-mono text-blue-500/60 tabular-nums">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })} Local Time</p>
                </div>
              </div>
              <div className="md:text-center space-y-4">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">Contact</p>
                <div className="flex flex-col gap-2">
                  <a href="mailto:hello@rma.studio" className="text-xl font-bold hover:text-blue-500 transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-blue-500">hello@rma.studio</a>
                  <p className="text-sm text-white/40 italic">Disponible pour de nouvelles opportunités</p>
                </div>
              </div>
              <div className="md:text-right space-y-4">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">Réseaux</p>
                <div className="flex md:justify-end gap-4">
                  {[{ Icon: Github, link: "#" }, { Icon: Linkedin, link: "#" }, { Icon: Mail, link: "#" }].map((item, i) => (
                    <a key={i} href={item.link} className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 text-white/50 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300">
                      <item.Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">RMA Digital Experience © {new Date().getFullYear()}</span>
              </div>
              <div className="flex gap-8 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
                <a href="#" className="hover:text-white transition-colors">Politique Cookies</a>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          .outline-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2); }
          .outline-text:hover { -webkit-text-stroke: 1px transparent; }
        `}</style>
      </footer>
    </div>
  );
};

export default ModernPortfolio;