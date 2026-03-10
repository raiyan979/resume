import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward, MdSignLanguage, MdDashboard, MdBrush } from "react-icons/md";
import { SiOpenai, SiGooglechrome } from "react-icons/si";

const getIconContainerStyle = (bg: string, color: string): React.CSSProperties => ({
  background: bg,
  color: color,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "80px",
  borderRadius: "12px",
});

const projects = [
  {
    title: "SentinAI",
    category: "TELUS AI Hackathon",
    tools: "JavaScript, Chrome Extension API, OpenAI GPT-4o-mini",
    image: "/images/sentinai_placeholder.png",
    icon: (
      <div style={getIconContainerStyle("linear-gradient(135deg, #1a1a2e, #16213e)", "#74aa9c")}>
        <SiOpenai />
      </div>
    ),
  },
  {
    title: "Sign Language Interpreter",
    category: "Accessibility",
    tools: "Python, MediaPipe, OpenCV",
    image: "/images/signlanguage_placeholder.png",
    icon: (
      <div style={getIconContainerStyle("linear-gradient(135deg, #0d1b2a, #1b2838)", "#5eead4")}>
        <MdSignLanguage />
      </div>
    ),
  },
  {
    title: "Clinical Dashboard & Analytics",
    category: "ERP System",
    tools: "Java Swing, Python, SQL",
    image: "/images/dashboard_placeholder.png",
    icon: (
      <div style={getIconContainerStyle("linear-gradient(135deg, #0a1628, #112240)", "#64ffda")}>
        <MdDashboard />
      </div>
    ),
  },
  {
    title: "Job Application Auto-Filler",
    category: "Browser Automation",
    tools: "JavaScript, Chrome Extension API",
    image: "/images/autofiller_placeholder.png",
    icon: (
      <div style={getIconContainerStyle("linear-gradient(135deg, #1a0a00, #2d1500)", "#f97316")}>
        <SiGooglechrome />
      </div>
    ),
  },
  {
    title: "Java Drawing App & Python Image",
    category: "Desktop Apps",
    tools: "Java Swing, Pillow",
    image: "/images/drawingapp_placeholder.png",
    icon: (
      <div style={getIconContainerStyle("linear-gradient(135deg, #0d0d1a, #1a0a2e)", "#a78bfa")}>
        <MdBrush />
      </div>
    ),
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage image={project.image} alt={project.title} icon={project.icon} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
