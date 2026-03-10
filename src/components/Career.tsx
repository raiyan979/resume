import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Junior Developer</h4>
                <h5>Eshock</h5>
              </div>
              <h3>2019 - 2021</h3>
            </div>
            <p>
              Developed and deployed custom e-commerce modules in JavaScript.
              Managed end-to-end project lifecycles and built monitoring systems that
              reduced site downtime.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Technical Assistant — CCTV & Displays</h4>
                <h5>Airport Terminal</h5>
              </div>
              <h3>2020</h3>
            </div>
            <p>
              Configured and maintained Flight Information Display Systems (FIDS)
              for real-time data relay in high-traffic terminal environments.
              Maintained 99% system uptime through hardware-software troubleshooting.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Supervisor</h4>
                <h5>AAM Furnishers</h5>
              </div>
              <h3>2023 - 2024</h3>
            </div>
            <p>
              Managed 20+ employees across two warehouses. Led operational
              security protocols and optimized supply chain workflows, improving
              on-time delivery by 20%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
