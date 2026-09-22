import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

// External official portal reference (used solely in the Service Details page footer)
const officialWebsites = {
  "Birth Certificate": "https://dc.crsorgi.gov.in/",
  "Death Certificate": "https://dc.crsorgi.gov.in/",
  "Income Certificate": "https://www.india.gov.in/services",
  "Caste Certificate": "https://www.india.gov.in/services",
  "Driving Licence": "https://parivahan.gov.in/",
  "Residence Certificate": "https://www.india.gov.in/services",
  "Aadhaar Card Update": "https://uidai.gov.in/",
  "PAN Card": "https://www.incometax.gov.in/",
  "Voter ID": "https://voters.eci.gov.in/",
  "Ration Card": "https://nfsa.gov.in/",
  "Passport": "https://www.passportindia.gov.in/",
  "Vehicle Registration": "https://parivahan.gov.in/",
  "Learner Licence": "https://parivahan.gov.in/",
  "Property Tax Payment": "https://cdma.ap.gov.in/",
  "Water Connection": "https://cdma.ap.gov.in/",
  "Marriage Certificate": "https://www.india.gov.in/services",
  "Community Certificate": "https://www.india.gov.in/",
  "Domicile Certificate": "https://www.india.gov.in/services",
  "Senior Citizen Certificate": "https://www.meseva.gov.in/",
  "Electricity Connection": "https://www.apspdcl.in/",
};

// Department icon mapping for service cards
function getDepartmentIcon(department = "") {
  const dept = department.toLowerCase();
  if (dept.includes("revenue") || dept.includes("land") || dept.includes("registration")) return "📜";
  if (dept.includes("transport") || dept.includes("vehicle") || dept.includes("parivahan")) return "🚗";
  if (dept.includes("civil") || dept.includes("supplies") || dept.includes("food") || dept.includes("ration")) return "🌾";
  if (dept.includes("identity") || dept.includes("aadhaar") || dept.includes("pan") || dept.includes("voter")) return "🪪";
  if (dept.includes("external") || dept.includes("passport")) return "🌐";
  if (dept.includes("municipal") || dept.includes("tax") || dept.includes("water") || dept.includes("power")) return "🏛️";
  if (dept.includes("social") || dept.includes("welfare")) return "👥";
  return "📄";
}

/* =========================================================================
   HOMEPAGE COMPONENT
   ========================================================================= */
function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load services from backend");
        }
        return response.json();
      })
      .then((data) => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError("Unable to connect to the GOVDOC backend server. Please verify the FastAPI service is running.");
        setLoading(false);
      });
  }, []);

  const departments = [
    "All",
    ...new Set(services.map((service) => service.department).filter(Boolean)),
  ];

  const filteredServices = services.filter((service) => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !search ||
      service.name.toLowerCase().includes(search) ||
      (service.description && service.description.toLowerCase().includes(search)) ||
      (service.department && service.department.toLowerCase().includes(search));

    const matchesDepartment =
      selectedDepartment === "All" || service.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const scrollToServices = () => {
    const elem = document.getElementById("services-directory");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="homepage-wrapper">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            OFFICIAL CITIZEN DOCUMENT DIRECTORY
          </div>

          <h1 className="hero-title">
            Know Your Documents.
            <br />
            <span className="hero-highlight">Get Things Done.</span>
          </h1>

          <p className="hero-subtitle">
            GOVDOC is your dedicated informational portal that helps citizens easily find the exact
            documents required for government services. Save your valuable time, avoid repeated visits,
            and head to the counter fully prepared.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-explore"
              onClick={scrollToServices}
            >
              Explore Services
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
              </svg>
            </button>
            <a href="#about" className="btn btn-secondary">
              Learn About GOVDOC
            </a>
          </div>

          {/* Quick value propositions */}
          <div className="hero-pillars">
            <div className="pillar-item">
              <span className="pillar-icon">✓</span>
              <div>
                <strong>Verified Checklists</strong>
                <span>Official document criteria</span>
              </div>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon">🏢</span>
              <div>
                <strong>Counter Guidance</strong>
                <span>Exact office & window info</span>
              </div>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon">⏱️</span>
              <div>
                <strong>Zero Confusion</strong>
                <span>No wasted citizen visits</span>
              </div>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon">🔒</span>
              <div>
                <strong>100% Free</strong>
                <span>Pure public information</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING STATISTICS BAR */}
      <div className="stats-bar-wrapper">
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-number">{services.length || "20+"}</div>
            <div className="stat-label">Government Services</div>
            <div className="stat-sub">Fully cataloged</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <div className="stat-number">{departments.length > 1 ? departments.length - 1 : "6+"}</div>
            <div className="stat-label">State & Civic Departments</div>
            <div className="stat-sub">Centralized directory</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">Free Informational Access</div>
            <div className="stat-sub">No fees or registrations</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Application Hassles</div>
            <div className="stat-sub">Know before you visit</div>
          </div>
        </div>
      </div>

      {/* SERVICES DIRECTORY SECTION */}
      <section id="services-directory" className="services-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">SERVICES DIRECTORY</div>
            <h2 className="section-title">Browse Government Services</h2>
            <p className="section-description">
              Find the exact checklist of mandatory paperwork, supporting certificates, and counter
              timings for your service.
            </p>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="controls-panel">
            <div className="search-box">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search services (e.g. Passport, Caste Certificate, Driving Licence, PAN...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* DEPARTMENT FILTER PILLS */}
            <div className="department-pills">
              <span className="filter-label">Department:</span>
              <div className="pills-scroll">
                {departments.map((dept) => {
                  const count =
                    dept === "All"
                      ? services.length
                      : services.filter((s) => s.department === dept).length;

                  return (
                    <button
                      key={dept}
                      type="button"
                      className={`pill-btn ${selectedDepartment === dept ? "active" : ""}`}
                      onClick={() => setSelectedDepartment(dept)}
                    >
                      {dept === "All" ? "All Departments" : dept}
                      <span className="pill-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SERVICES GRID */}
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading government services directory from server...</p>
            </div>
          )}

          {error && (
            <div className="error-banner">
              <div className="error-icon">⚠️</div>
              <div className="error-text">
                <h3>Backend Server Notice</h3>
                <p>{error}</p>
                <small>Tip: Start your FastAPI backend at <code>http://127.0.0.1:8000</code> to view live services.</small>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="results-summary">
                <span>
                  Showing <strong>{filteredServices.length}</strong> of{" "}
                  <strong>{services.length}</strong> services
                </span>
                {(searchTerm || selectedDepartment !== "All") && (
                  <button
                    type="button"
                    className="reset-filters-btn"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDepartment("All");
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="services-grid">
                {filteredServices.map((service, index) => (
                  <div className="service-card" key={service.id}>
                    <div className="service-card-top">
                      <span className="service-index">
                        SERVICE {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="service-dept-badge">
                        {service.department || "Public Service"}
                      </span>
                    </div>

                    <div className="service-card-body">
                      <div className="service-icon-box">
                        <span>{getDepartmentIcon(service.department)}</span>
                      </div>
                      <h3 className="service-name">{service.name}</h3>
                      <p className="service-desc">{service.description}</p>
                    </div>

                    <div className="service-card-footer">
                      <div className="service-checklist-hint">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Document checklist ready</span>
                      </div>
                      <Link
                        to={`/services/${service.id}`}
                        className="btn-view-details"
                      >
                        View Details
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No services matched your search</h3>
                  <p>
                    We couldn't find any services matching &ldquo;{searchTerm}&rdquo; under{" "}
                    {selectedDepartment === "All" ? "all departments" : selectedDepartment}.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDepartment("All");
                    }}
                  >
                    View All Services
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-content">
              <div className="section-tag">ABOUT GOVDOC</div>
              <h2 className="section-title">Built for Citizens. Designed for Clarity.</h2>
              <p className="about-lead">
                Every year, citizens spend hours visiting administrative counters only to be told they
                are missing one photocopy, a specific affidavit, or an original verification certificate.
              </p>
              <p className="about-body">
                <strong>GOVDOC</strong> bridges this information gap. We provide a single, verified, and
                free reference directory that catalogs the exact required documents, office desks, and
                procedural guidelines before you step out of your home.
              </p>

              <div className="about-features-list">
                <div className="feature-row">
                  <div className="feature-row-icon">1</div>
                  <div>
                    <h4>Verified Checklist Requirements</h4>
                    <p>Clearly know which documents are strictly mandatory versus optional supporting proofs.</p>
                  </div>
                </div>
                <div className="feature-row">
                  <div className="feature-row-icon">2</div>
                  <div>
                    <h4>Exact Counter & Office Timings</h4>
                    <p>Locate the exact counter number, desk, and operational hours to avoid queue confusion.</p>
                  </div>
                </div>
                <div className="feature-row">
                  <div className="feature-row-icon">3</div>
                  <div>
                    <h4>Pure Public Service</h4>
                    <p>No account sign-ups, no application fees, and no third-party forms. Pure citizen empowerment.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-card-visual">
              <div className="visual-card">
                <div className="visual-emblem">🏛️</div>
                <h3>Citizen Notice</h3>
                <p>
                  GOVDOC is strictly an informational directory. All government services must be
                  submitted directly at their respective department counters or designated official portals.
                </p>
                <div className="visual-points">
                  <div className="point-item">
                    <span>✓</span> No Application Forms
                  </div>
                  <div className="point-item">
                    <span>✓</span> No Application ID Needed
                  </div>
                  <div className="point-item">
                    <span>✓</span> 100% Free Information
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & CITIZEN SUPPORT SECTION */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <div className="contact-card-banner">
            <div className="contact-info">
              <div className="section-tag">CITIZEN ASSISTANCE</div>
              <h2>Have Questions or Need Document Help?</h2>
              <p>
                Our directory information is compiled from official government departmental notices.
                For inquiries regarding specific application processing, reach out through the official
                citizen helpline.
              </p>

              <div className="contact-details-grid">
                <div className="contact-detail-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <strong>National Citizen Helpline</strong>
                    <p>Toll Free: 1800-GOV-DOCS (9 AM - 6 PM)</p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <span className="contact-icon">📧</span>
                  <div>
                    <strong>Directory Support</strong>
                    <p>support@govdoc.info</p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <span className="contact-icon">🏢</span>
                  <div>
                    <strong>Civic Center Desks</strong>
                    <p>Available at all District Collectorates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================================
   SERVICE DETAILS PAGE COMPONENT
   ========================================================================= */
function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [officeDetails, setOfficeDetails] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const loadServiceData = async () => {
      try {
        setLoading(true);

        // Fetch service info from services list
        const servicesResponse = await fetch(`${API_URL}/services`);
        if (!servicesResponse.ok) {
          throw new Error("Unable to fetch services list");
        }
        const servicesData = await servicesResponse.json();
        const foundService = (servicesData.services || []).find(
          (item) => item.id === Number(serviceId)
        );

        if (!foundService) {
          throw new Error("Service not found in directory");
        }
        setService(foundService);

        // Fetch documents
        const docsResponse = await fetch(`${API_URL}/services/${serviceId}/documents`);
        if (docsResponse.ok) {
          const docsData = await docsResponse.json();
          setDocuments(docsData.required_documents || []);
        }

        // Fetch office details
        const officeResponse = await fetch(`${API_URL}/services/${serviceId}/office`);
        if (officeResponse.ok) {
          const officeData = await officeResponse.json();
          setOfficeDetails(officeData.office_details || []);
        }

        // Fetch instructions
        const instructionsResponse = await fetch(`${API_URL}/services/${serviceId}/instructions`);
        if (instructionsResponse.ok) {
          const instData = await instructionsResponse.json();
          setInstructions(instData.instructions || []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Details loading error:", err);
        setError("Unable to load service details from the backend server.");
        setLoading(false);
      }
    };

    loadServiceData();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="details-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading verified service checklist...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="details-error-container">
        <div className="error-banner">
          <div className="error-icon">⚠️</div>
          <div className="error-text">
            <h3>Service Not Found</h3>
            <p>{error || "The requested government service does not exist."}</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
              ← Return to Services Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mandatoryDocsCount = documents.filter((d) => d.mandatory).length;

  return (
    <div className="service-details-wrapper">
      <div className="details-container">
        {/* Breadcrumb Navigation */}
        <div className="details-breadcrumb">
          <Link to="/" className="back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to All Services
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{service.name}</span>
        </div>

        {/* Hero Header Card */}
        <div className="details-hero-card">
          <div className="details-hero-text">
            <div className="details-meta-tags">
              <span className="dept-tag">{service.department || "Government Service"}</span>
              <span className="info-tag">Informational Checklist</span>
            </div>
            <h1 className="details-title">{service.name}</h1>
            <p className="details-description">{service.description}</p>
          </div>

          <div className="details-hero-badge">
            <div className="badge-icon">{getDepartmentIcon(service.department)}</div>
            <div className="badge-count">
              <strong>{documents.length}</strong> Documents
            </div>
            <div className="badge-sub">{mandatoryDocsCount} strictly mandatory</div>
          </div>
        </div>

        {/* Informational Guidance Notice */}
        <div className="informational-notice-banner">
          <div className="notice-icon">ℹ️</div>
          <div className="notice-content">
            <strong>Citizen Pre-Visit Guidance</strong>
            <p>
              Please keep both original documents and photocopies ready as specified. GOVDOC is an
              informational guide to prepare you before visiting the office counter.
            </p>
          </div>
        </div>

        {/* SECTION 01: REQUIRED DOCUMENTS */}
        <div className="details-section-card">
          <div className="card-section-header">
            <div className="section-number-pill">01</div>
            <div>
              <h2 className="card-section-title">Required Documents</h2>
              <p className="card-section-subtitle">
                Keep these documents organized and verified before your submission
              </p>
            </div>
          </div>

          {documents.length > 0 ? (
            <div className="documents-list">
              {documents.map((doc, idx) => (
                <div className="document-item-card" key={doc.id || idx}>
                  <div className="doc-num-circle">{idx + 1}</div>
                  <div className="doc-item-content">
                    <div className="doc-item-title-row">
                      <h3 className="doc-name">{doc.document_name}</h3>
                      {doc.mandatory ? (
                        <span className="badge-mandatory">Mandatory</span>
                      ) : (
                        <span className="badge-optional">Supporting Proof</span>
                      )}
                    </div>
                    {doc.description && (
                      <p className="doc-desc">{doc.description}</p>
                    )}
                  </div>
                  <div className="doc-status-indicator">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="16 10 11 15 8 12"></polyline>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-section-notice">
              <p>No specific document requirements listed for this service.</p>
            </div>
          )}
        </div>

        {/* SECTION 02 & 03: TWO COLUMN LAYOUT FOR OFFICE & INSTRUCTIONS */}
        <div className="details-two-columns">
          {/* SECTION 02: OFFICE DETAILS */}
          <div className="details-section-card">
            <div className="card-section-header">
              <div className="section-number-pill">02</div>
              <div>
                <h2 className="card-section-title">Office & Counter Details</h2>
                <p className="card-section-subtitle">Where to submit your verified documents</p>
              </div>
            </div>

            {officeDetails.length > 0 ? (
              <div className="office-cards-list">
                {officeDetails.map((office, idx) => (
                  <div className="office-item-card" key={office.id || idx}>
                    <div className="office-name-row">
                      <span className="office-pin-icon">🏛️</span>
                      <h4 className="office-name">{office.office_name}</h4>
                    </div>

                    <div className="office-details-table">
                      {office.counter && (
                        <div className="office-row">
                          <span className="row-label">Counter / Desk:</span>
                          <span className="row-value counter-highlight">{office.counter}</span>
                        </div>
                      )}
                      {office.address && (
                        <div className="office-row">
                          <span className="row-label">Address:</span>
                          <span className="row-value">{office.address}</span>
                        </div>
                      )}
                      {office.working_hours && (
                        <div className="office-row">
                          <span className="row-label">Working Hours:</span>
                          <span className="row-value hours-highlight">{office.working_hours}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-section-notice">
                <p>Office and counter details are being updated by the department.</p>
              </div>
            )}
          </div>

          {/* SECTION 03: INSTRUCTIONS */}
          <div className="details-section-card">
            <div className="card-section-header">
              <div className="section-number-pill">03</div>
              <div>
                <h2 className="card-section-title">Important Instructions</h2>
                <p className="card-section-subtitle">Key procedural rules and guidance</p>
              </div>
            </div>

            {instructions.length > 0 ? (
              <ol className="instructions-checklist">
                {instructions.map((inst, idx) => (
                  <li className="instruction-step" key={inst.id || idx}>
                    <span className="step-icon">✓</span>
                    <span className="step-text">{inst.instruction}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="empty-section-notice">
                <p>General departmental instructions apply for this service.</p>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM OFFICIAL PORTAL REFERENCE (Informational Link on Detail Page) */}
        <div className="official-portal-banner">
          <div className="portal-banner-info">
            <span className="portal-tag">OFFICIAL GOVERNMENT PORTAL REFERENCE</span>
            <h3>Need further departmental information?</h3>
            <p>
              You may check the official portal of the concerned state or central department for live
              status tracking and gazette notifications.
            </p>
          </div>
          <a
            href={officialWebsites[service.name] || "https://www.meseva.gov.in/"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-official-external"
          >
            Visit Department Portal
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN APP SHELL (HEADER, NAVIGATION, FOOTER)
   ========================================================================= */
function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      // If we are on details page, navigating to / will be handled by Link
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="govdoc-app">
      {/* 1. DARK OLIVE TOP BAR */}
      <div className="top-utility-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <span className="top-bar-flag">🇮🇳</span>
            <span>Official Citizen Document Directory • Free Public Information Portal</span>
          </div>
          <div className="top-bar-right">
            <span>Operating Hours: Mon – Sat (9:00 AM – 5:30 PM)</span>
            <span className="top-bar-badge">No Login Required</span>
          </div>
        </div>
      </div>

      {/* 2. ELEGANT WHITE NAVBAR */}
      <header className="main-navbar">
        <div className="navbar-container">
          {/* Logo & Name on Left */}
          <Link to="/" className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="logo-emblem">
              <span>G</span>
            </div>
            <div className="logo-titles">
              <span className="logo-main">GOVDOC</span>
              <span className="logo-sub">Citizen Document Portal</span>
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Navigation Links */}
          <nav className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
            <Link
              to="/"
              className="nav-link"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </Link>
            <Link
              to="/"
              className="nav-link"
              onClick={() => handleNavClick("services-directory")}
            >
              Services
            </Link>
            <Link
              to="/"
              className="nav-link"
              onClick={() => handleNavClick("about")}
            >
              About
            </Link>
            <Link
              to="/"
              className="nav-link"
              onClick={() => handleNavClick("contact")}
            >
              Contact
            </Link>
            <button
              type="button"
              className="nav-action-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                if (location.pathname !== "/") {
                  window.location.href = "/#services-directory";
                } else {
                  const elem = document.getElementById("services-directory");
                  if (elem) elem.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Document Checklist
            </button>
          </nav>
        </div>
      </header>

      {/* 3. MAIN CONTENT ROUTER */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailsPage />} />
        </Routes>
      </main>

      {/* 4. FOOTER */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <div className="footer-logo">
                <div className="footer-emblem">G</div>
                <span className="footer-title">GOVDOC</span>
              </div>
              <p className="footer-description">
                A public document checklist and informational directory empowering citizens with
                verified documentation requirements, counter guidance, and departmental rules across India.
              </p>
              <div className="footer-guarantee">
                <span>🛡️ Pure Informational Portal • Zero Fees • No Application Forms</span>
              </div>
            </div>

            <div className="footer-links-col">
              <h4>Quick Navigation</h4>
              <ul>
                <li>
                  <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={() => handleNavClick("services-directory")}>
                    Services Directory
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={() => handleNavClick("about")}>
                    About GOVDOC
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={() => handleNavClick("contact")}>
                    Contact & Helpdesk
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Common Services</h4>
              <ul>
                <li><span>Aadhaar Card Guidelines</span></li>
                <li><span>Driving Licence Requirements</span></li>
                <li><span>Birth & Death Certificates</span></li>
                <li><span>Income & Caste Verification</span></li>
                <li><span>Passport Documentation</span></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Citizen Helpdesk</h4>
              <p className="footer-contact-text">
                For administrative queries, contact the public guidance cell:
              </p>
              <div className="footer-helpline-box">
                <span className="helpline-title">Toll-Free Helpline</span>
                <span className="helpline-number">1800-GOV-DOCS</span>
                <span className="helpline-hours">Mon - Sat: 9:00 AM - 5:30 PM</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>© 2026 GOVDOC. Citizen Document Information Framework. All Rights Reserved.</p>
            <p className="footer-disclaimer">
              Disclaimer: GOVDOC is an independent informational initiative to assist citizens with
              document checklists. Applications must be submitted directly to the authorized government
              departments.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;