import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import profilePhoto from 'figma:asset/ded0630404d74fff4e6e7fd77f6951e9946b098c.png';

// Define all pages - each page is a unique surface
const bookPages = [
  // Page 0: Front Cover
  {
    id: 'cover-front',
    side: 'front',
    type: 'cover',
  },
  // Page 1: Inside Front Cover (back of cover)
  {
    id: 'cover-back',
    side: 'back',
    type: 'intro',
  },
  // Page 2: Professional Summary
  {
    id: 'page-2',
    side: 'front',
    type: 'summary',
  },
  // Page 3: Technical Skills
  {
    id: 'page-3',
    side: 'back',
    type: 'skills',
  },
  // Page 4: Experience Part 1
  {
    id: 'page-4',
    side: 'front',
    type: 'experience-1',
  },
  // Page 5: Experience Part 2
  {
    id: 'page-5',
    side: 'back',
    type: 'experience-2',
  },
  // Page 6: Education
  {
    id: 'page-6',
    side: 'front',
    type: 'education',
  },
  // Page 7: Certifications
  {
    id: 'page-7',
    side: 'back',
    type: 'certifications',
  },
  // Page 8: Projects
  {
    id: 'page-8',
    side: 'front',
    type: 'projects',
  },
  // Page 9: Contact
  {
    id: 'page-9',
    side: 'back',
    type: 'contact',
  },
  // Page 10: Back Cover
  {
    id: 'back-cover',
    side: 'front',
    type: 'back-cover',
  },
];

export function Book3D() {
  const [currentSpread, setCurrentSpread] = useState(0); // 0 = closed, 1 = first spread, etc.
  const [isFlipping, setIsFlipping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openBook = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsOpen(true);
      setCurrentSpread(1);
      setIsFlipping(false);
    }, 600);
  };

  const nextPage = () => {
    if (!isFlipping && currentSpread < Math.floor(bookPages.length / 2)) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(currentSpread + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevPage = () => {
    if (!isFlipping && currentSpread > 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(currentSpread - 1);
        setIsFlipping(false);
      }, 600);
    } else if (!isFlipping && currentSpread === 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(0);
        setIsOpen(false);
        setIsFlipping(false);
      }, 600);
    }
  };

  return (
    <div className="relative z-10">
      <div className="perspective-[2500px]">
        <div className="relative w-[90vw] max-w-[1200px] h-[75vh] max-h-[750px] mx-auto">
          {/* Book Shadow */}
          <div className="absolute inset-0 bg-black/40 blur-3xl transform translate-y-12 scale-95"></div>

          {/* Book Container */}
          <div 
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Left Side of Book (static when open) */}
            <motion.div
              className="absolute left-0 w-1/2 h-full"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
            >
              {/* Show left page content based on current spread */}
              {isOpen && currentSpread > 0 && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-l-xl shadow-2xl border-r border-slate-300/50">
                  {/* Horizontal ruled lines */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-l-xl">
                    {[...Array(30)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 h-px bg-slate-300/40"
                        style={{
                          top: `${i * 3.33}%`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/5 to-transparent"></div>
                  <div className="h-full p-6 md:p-8 flex flex-col overflow-hidden relative z-10">
                    <PageContent page={bookPages[(currentSpread - 1) * 2 + 1]} />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Side Pages (flipping pages) */}
            <div 
              className="absolute right-0 w-1/2 h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Page edge lines when closed - HIGHLY VISIBLE - Behind the cover */}
              {!isOpen && (
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute right-0 h-full"
                      style={{
                        width: '3px',
                        backgroundColor: i % 2 === 0 ? '#475569' : '#64748b',
                        transform: `translateX(${-i * 3}px)`,
                        opacity: 0.9 - i * 0.03,
                        boxShadow: '-1px 0 2px rgba(0,0,0,0.2)',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Render all pages that can flip */}
              {bookPages.map((page, index) => {
                // Calculate which spread this page belongs to
                const pageSpread = Math.floor(index / 2);
                
                // Determine if this page should be visible and its rotation
                let rotateY = 0;
                let zIndex = bookPages.length - index;
                let isVisible = true;

                if (!isOpen) {
                  // Book is closed - all pages stacked on right
                  rotateY = 0;
                  isVisible = index === 0; // Only show front cover
                } else if (pageSpread < currentSpread) {
                  // Page has been flipped to the left
                  rotateY = -180;
                  isVisible = false;
                } else if (pageSpread === currentSpread) {
                  // Current page spread - show right page
                  rotateY = 0;
                  isVisible = index % 2 === 0; // Only show front of pages (even indices)
                } else {
                  // Future pages - stacked on right
                  rotateY = 0;
                  isVisible = index === currentSpread * 2; // Only show top page
                }

                // Special handling for opening/closing animation
                if (index === 0 && isFlipping && currentSpread === 1 && isOpen) {
                  rotateY = -180; // Cover is flipping
                  isVisible = true;
                } else if (index === 0 && isFlipping && currentSpread === 0 && !isOpen) {
                  rotateY = 0; // Cover is closing
                  isVisible = true;
                }

                // Handle current flipping page
                if (isFlipping && pageSpread === currentSpread - 1 && currentSpread > 1) {
                  rotateY = -180;
                  isVisible = true;
                }

                if (!isVisible && !isFlipping) return null;

                return (
                  <motion.div
                    key={page.id}
                    className="absolute inset-0"
                    style={{
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'left center',
                      zIndex: index === 0 ? 100 : zIndex, // Cover always on top
                    }}
                    animate={{
                      rotateY,
                      opacity: isFlipping && (rotateY === -180 || (index > 0 && pageSpread === currentSpread - 1)) ? [1, 0, 0, 1] : 1,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.43, 0.13, 0.23, 0.96],
                      opacity: {
                        duration: 0.6,
                        times: [0, 0.3, 0.7, 1],
                      }
                    }}
                  >
                    {/* Front of page */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-r-xl shadow-2xl backface-hidden border-l border-slate-300/50"
                      style={{
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      {/* Horizontal ruled lines */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-r-xl">
                        {[...Array(30)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute left-0 right-0 h-px bg-slate-300/40"
                            style={{
                              top: `${i * 3.33}%`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/5 to-transparent"></div>
                      <div className="h-full p-6 md:p-8 flex flex-col overflow-hidden relative z-10">
                        <PageContent page={page} />
                      </div>
                    </div>

                    {/* Back of page (shows when flipped) */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-l-xl shadow-2xl backface-hidden border-r border-slate-300/50"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      {/* Horizontal ruled lines */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-l-xl">
                        {[...Array(30)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute left-0 right-0 h-px bg-slate-300/40"
                            style={{
                              top: `${i * 3.33}%`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/5 to-transparent"></div>
                      <div className="h-full p-6 md:p-8 flex flex-col overflow-hidden relative z-10" style={{ transform: 'scaleX(-1)' }}>
                        <div style={{ transform: 'scaleX(-1)' }}>
                          {index + 1 < bookPages.length && <PageContent page={bookPages[index + 1]} />}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Book Spine - visible when open */}
            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-inner"
              style={{
                transform: 'translateX(-50%)',
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-slate-600/30 via-transparent to-black/20"></div>
              {/* Name on Spine */}
              <div 
                className="absolute top-1/2 left-1/2 text-slate-200 whitespace-nowrap"
                style={{
                  transform: 'translate(-50%, -50%) rotate(-90deg)',
                  transformOrigin: 'center',
                  fontSize: '14px',
                  letterSpacing: '2px',
                }}
              >
                MUSA BANATHI NKOSI
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        {!isOpen ? (
          <Button
            onClick={openBook}
            disabled={isFlipping}
            size="lg"
            className="bg-slate-700 hover:bg-slate-800 text-white px-8"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Open Book
          </Button>
        ) : (
          <>
            <Button
              onClick={prevPage}
              disabled={isFlipping}
              variant="outline"
              size="lg"
              className="bg-white/90 hover:bg-white transition-all"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            
            <div className="text-white/90 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              {currentSpread === 0 ? 'Closed' : `Spread ${currentSpread} of ${Math.floor(bookPages.length / 2)}`}
            </div>

            <Button
              onClick={nextPage}
              disabled={currentSpread >= Math.floor(bookPages.length / 2) || isFlipping}
              variant="outline"
              size="lg"
              className="bg-white/90 hover:bg-white transition-all"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function PageContent({ page }: { page: typeof bookPages[0] }) {
  if (page.type === 'cover') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-r-xl -m-6 md:-m-8 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white"
        >
          <div className="mb-5">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-slate-400/40 shadow-2xl">
              <img src={profilePhoto} alt="Musa Banathi Nkosi" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-white mb-2">Musa Banathi Nkosi</h1>
          <div className="h-px w-28 bg-slate-400/40 mx-auto my-3"></div>
          <p className="text-slate-200 text-sm mb-4">Software Developer & QA Tester</p>
          <div className="inline-block px-4 py-1.5 bg-slate-600/40 backdrop-blur-sm rounded-full text-slate-200 text-xs">
            Professional Portfolio
          </div>
        </motion.div>
      </div>
    );
  }

  if (page.type === 'intro') {
    return (
      <div className="h-full flex flex-col justify-center">
        <div className="mb-4 pb-3 border-b-2 border-slate-700/30">
          <h2 className="text-slate-900 text-xl">About Me</h2>
          <div className="text-xs text-slate-600 mt-1">A Journey of Development & Quality</div>
        </div>
        <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
          <p>
            Welcome to my professional portfolio. I'm a passionate technologist who thrives at the intersection of development and quality assurance.
          </p>
          <p>
            With a strong foundation in software development and a keen eye for detail in testing, I bring a unique perspective to building robust applications.
          </p>
          <p>
            Based in Cape Town, South Africa, I'm committed to delivering high-quality software solutions that make a difference.
          </p>
        </div>
      </div>
    );
  }

  if (page.type === 'summary') {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 pb-3 border-b-2 border-slate-700/30">
          <h2 className="text-slate-900 text-xl">Professional Summary</h2>
        </div>
        <div className="bg-gradient-to-br from-slate-700/10 to-slate-600/5 p-4 rounded-lg border-l-4 border-slate-700">
          <p className="text-slate-800 text-sm leading-relaxed mb-3">
            Adaptable Software Developer & QA Tester with experience in Java, Kotlin, Python, SQL, and manual testing. Skilled in backend development, UI design, and quality assurance, with proven ability to reduce production bugs and deliver projects on time.
          </p>
          <p className="text-slate-800 text-sm leading-relaxed">
            Strong collaborator in Agile/Scrum teams, committed to building robust, user-focused applications and ensuring high-quality software delivery.
          </p>
        </div>
      </div>
    );
  }

  if (page.type === 'skills') {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 pb-3 border-b-2 border-slate-700/30">
          <h2 className="text-slate-900 text-xl">Technical Skills</h2>
        </div>
        <div className="space-y-2.5 flex-1">
          <div className="bg-gradient-to-r from-slate-700/10 to-transparent p-3 rounded-lg">
            <div className="text-slate-900 text-sm mb-1">Programming</div>
            <p className="text-slate-700 text-xs">Java, Kotlin, Python, C#, C++, SQL</p>
          </div>
          <div className="bg-gradient-to-r from-slate-700/10 to-transparent p-3 rounded-lg">
            <div className="text-slate-900 text-sm mb-1">Testing & QA</div>
            <p className="text-slate-700 text-xs">Manual QA, Test Case Design, Bug Tracking, Jira</p>
          </div>
          <div className="bg-gradient-to-r from-slate-700/10 to-transparent p-3 rounded-lg">
            <div className="text-slate-900 text-sm mb-1">Web Development</div>
            <p className="text-slate-700 text-xs">HTML, CSS (Basic)</p>
          </div>
          <div className="bg-gradient-to-r from-slate-700/10 to-transparent p-3 rounded-lg">
            <div className="text-slate-900 text-sm mb-1">Tools & Platforms</div>
            <p className="text-slate-700 text-xs">Git, Postman, AWS (Fundamentals)</p>
          </div>
          <div className="bg-gradient-to-r from-slate-700/10 to-transparent p-3 rounded-lg">
            <div className="text-slate-900 text-sm mb-1">Methodologies</div>
            <p className="text-slate-700 text-xs">Agile, Scrum</p>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'experience-1') {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 pb-3 border-b-2 border-slate-700/30">
          <h2 className="text-slate-900 text-xl">Professional Experience</h2>
        </div>
        <div className="space-y-4 flex-1">
          <div className="relative pl-5 border-l-2 border-slate-700/30">
            <div className="absolute -left-2 top-0 w-3.5 h-3.5 rounded-full bg-slate-700"></div>
            <div className="text-slate-900 text-sm mb-0.5">QA Tester (Internship)</div>
            <div className="text-slate-600 text-xs mb-0.5">Plum Systems – Cape Town</div>
            <div className="text-slate-500 text-xs mb-2">Jan 2025 – Present</div>
            <ul className="space-y-1.5">
              <li className="text-slate-700 text-xs flex items-start">
                <span className="text-slate-600 mr-2 flex-shrink-0">•</span>
                <span>Executed manual testing for 10+ Java/Kotlin applications, ensuring functionality, performance, and reliability</span>
              </li>
              <li className="text-slate-700 text-xs flex items-start">
                <span className="text-slate-600 mr-2 flex-shrink-0">•</span>
                <span>Designed and executed test cases, reducing production bugs by 20%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'experience-2') {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 pb-3 border-b-2 border-slate-700/30">
          <h2 className="text-slate-900 text-xl">Experience (cont.)</h2>
        </div>
        <div className="space-y-4 flex-1">
          <div className="relative pl-5 border-l-2 border-slate-700/30">
            <div className="absolute -left-2 top-0 w-3.5 h-3.5 rounded-full bg-slate-700"></div>
            <div className="text-slate-700 text-xs space-y-1.5 mb-4">
              <div className="flex items-start">
                <span className="text-slate-600 mr-2 flex-shrink-0">•</span>
                <span>Collaborated with developers in Agile sprints, accelerating feature delivery</span>
              </div>
              <div className="flex items-start">
                <span className="text-slate-600 mr-2 flex-shrink-0">•</span>
                <span>Logged and tracked defects in Jira, improving visibility and resolution speed</span>
              </div>
            </div>
          </div>

          <div className="relative pl-5 border-l-2 border-slate-700/30">
            <div className="absolute -left-2 top-0 w-3.5 h-3.5 rounded-full bg-slate-700"></div>
            <div className="text-slate-900 text-sm mb-0.5">Student Developer</div>
            <div className="text-slate-600 text-xs mb-0.5">Cape Peninsula University of Technology</div>
            <div className="text-slate-500 text-xs mb-2">Feb 2023 – Oct 2023</div>
            <ul className="space-y-1.5">
              <li className="text-slate-700 text-xs flex items-start">
                <span className="text-slate-600 mr-2 flex-shrink-0">•</span>
                <span>Built a Python/SQL backend for tutoring website</span>
              </li>
              <li className="text-slate-700 text-xs flex items-start">
                <span className="text-slate-600 mr-2 flex-shrink-0">•</span>
                <span>Designed UI wireframes and registration workflows</span>
              </li>
              <li className="text-slate-700 text-xs flex items-start">
                <span className="text-slate-600 mr-2 flex-shrink-0">•</span>
                <span>Facilitated conflict resolution within project team</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'education') {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 pb-3 border-b-2 border-slate-700/30">
          <h2 className="text-slate-900 text-xl">Education</h2>
        </div>
        <div className="space-y-3 flex-1">
          <div className="bg-slate-700/5 p-3 rounded-lg border-l-4 border-slate-700">
            <div className="text-slate-900 text-sm mb-1">Diploma in ICT</div>
            <div className="text-xs text-slate-700 mb-0.5">Applications Development</div>
            <div className="text-xs text-slate-600">Cape Peninsula University of Technology</div>
            <div className="text-xs text-slate-500 mt-0.5">2022 – Present</div>
          </div>

          <div className="bg-slate-700/5 p-3 rounded-lg border-l-4 border-slate-600">
            <div className="text-slate-900 text-sm mb-1">Digital Marketing Certificate</div>
            <div className="text-xs text-slate-600">MANCOSA</div>
            <div className="text-xs text-slate-500 mt-0.5">2023 – 2024</div>
          </div>

          <div className="bg-slate-700/5 p-3 rounded-lg border-l-4 border-slate-500">
            <div className="text-slate-900 text-sm mb-1">Higher Certificate in ICT</div>
            <div className="text-xs text-slate-600">Cape Peninsula University of Technology</div>
            <div className="text-xs text-slate-500 mt-0.5">2021 – 2022</div>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'certifications') {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 pb-3 border-b-2 border-slate-700/30">
          <h2 className="text-slate-900 text-xl">Certifications</h2>
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex items-start p-3 bg-gradient-to-r from-slate-700/5 to-transparent rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-3 mt-1 flex-shrink-0"></div>
            <div>
              <div className="text-slate-900 text-sm">AWS Fundamentals</div>
              <div className="text-xs text-slate-600">Nerds Academy • 2025</div>
            </div>
          </div>

          <div className="flex items-start p-3 bg-gradient-to-r from-slate-700/5 to-transparent rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-3 mt-1 flex-shrink-0"></div>
            <div>
              <div className="text-slate-900 text-sm">Python Programming</div>
              <div className="text-xs text-slate-600">Mosh • 2025</div>
            </div>
          </div>

          <div className="flex items-start p-3 bg-gradient-to-r from-slate-700/5 to-transparent rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-3 mt-1 flex-shrink-0"></div>
            <div>
              <div className="text-slate-900 text-sm">Manual Software Testing</div>
              <div className="text-xs text-slate-600">Pavan • 2025</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'projects') {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 pb-3 border-b-2 border-slate-700/30">
          <h2 className="text-slate-900 text-xl">Featured Projects</h2>
        </div>
        <div className="space-y-3 flex-1">
          <div className="bg-gradient-to-br from-slate-700/10 to-slate-600/5 p-4 rounded-lg border border-slate-700/20">
            <div className="text-slate-900 text-sm mb-1.5">Tutoring Platform</div>
            <div className="inline-block px-2.5 py-0.5 bg-slate-700 text-white text-xs rounded-full mb-2">
              Python/SQL
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              Developed secure user authentication and designed responsive UI for an educational platform. Built scalable backend architecture.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-700/10 to-slate-600/5 p-4 rounded-lg border border-slate-700/20">
            <div className="text-slate-900 text-sm mb-1.5">Enrollment System</div>
            <div className="inline-block px-2.5 py-0.5 bg-slate-700 text-white text-xs rounded-full mb-2">
              Database Design
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              Optimized data flow architecture and integrated network components for efficient student enrollment management.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'contact') {
    return (
      <div className="h-full flex flex-col justify-center">
        <div className="mb-4 pb-3 border-b-2 border-slate-700/30">
          <h2 className="text-slate-900 text-xl">Get In Touch</h2>
        </div>
        
        <div className="bg-gradient-to-br from-slate-700/10 to-transparent p-4 rounded-lg mb-3">
          <div className="text-slate-900 text-sm mb-3">Contact Information</div>
          <div className="space-y-1.5 text-slate-700 text-xs">
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span>Foreshore, Cape Town, 8001</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📱</span>
              <span>067 747 5778</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✉️</span>
              <span>mbnkosi08@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-600/5 to-transparent p-4 rounded-lg border-l-4 border-slate-700">
          <div className="text-slate-900 text-sm mb-2">Reference</div>
          <div className="text-slate-900 text-sm">Irfaan Braaf</div>
          <div className="text-slate-600 text-xs mb-2">Team Leader, Plum Systems</div>
          <div className="space-y-1 text-xs text-slate-700">
            <div>📱 068 281 2839</div>
            <div>✉️ irfaan@plum.systems</div>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'back-cover') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-r-xl -m-6 md:-m-8 p-6">
        <div className="text-white">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/40 backdrop-blur-sm flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-slate-200 text-sm mb-3">Thank you for exploring my portfolio</p>
          <div className="h-px w-20 bg-slate-500/40 mx-auto my-3"></div>
          <p className="text-slate-400 text-xs">
            Let's build something amazing together
          </p>
        </div>
      </div>
    );
  }

  return null;
}
