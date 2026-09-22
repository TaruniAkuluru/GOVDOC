import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

// Official government websites
const officialWebsites = {
  "Birth Certificate": "https://ap.meeseva.gov.in/",
  "Death Certificate": "https://www.meseva.gov.in/",
  "Income Certificate": "https://www.meseva.gov.in/",
  "Caste Certificate": "https://www.meseva.gov.in/",
  "Driving Licence": "https://parivahan.gov.in/",
};

// ================================
// Services Page
// ================================

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
          throw new Error("Failed to load services");
        }

        return response.json();
      })
      .then((data) => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to connect to GOVDOC server.");
        setLoading(false);
      });
  }, []);

  const departments = [
    "All",
    ...new Set(services.map((service) => service.department)),
  ];

  const filteredServices = services.filter((service) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      service.name.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search);

    const matchesDepartment =
      selectedDepartment === "All" ||
      service.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h2>Government Services</h2>

        <p>
          Find government document services and view
          their required documents, office details and instructions.
        </p>
      </section>

      {/* Loading */}
      {loading && (
        <div className="message">
          Loading government services...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}

          <br />
          <br />

          Make sure the FastAPI backend is running.
        </div>
      )}

      {/* Services */}
      {!loading && !error && (
        <>
          {/* Search and Filter */}
          <div className="filters">

            <input
              type="text"
              placeholder="Search government services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={selectedDepartment}
              onChange={(e) =>
                setSelectedDepartment(e.target.value)
              }
              className="department-select"
              aria-label="Filter by department"
            >
              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>

          </div>

          {/* Service Cards */}
          <section className="services-container">

            {filteredServices.map((service) => (
              <div
                className="service-card"
                key={service.id}
              >

                <h3>
                  {service.name}
                </h3>

                <p className="department">
                  Department: {service.department}
                </p>

                <p className="description">
                  {service.description}
                </p>

                <div className="button-container">

                  {/* View Details */}
                  <Link
                    to={`/services/${service.id}`}
                    className="apply-button"
                  >
                    View Details
                  </Link>

                  {/* Official Website */}
                  <a
                    href={
                      officialWebsites[service.name] ||
                      "https://www.meseva.gov.in/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="official-button"
                  >
                    Official Website
                  </a>

                </div>

              </div>
            ))}

          </section>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="message">
              No government services found.
            </div>
          )}
        </>
      )}
    </>
  );
}

// ================================
// Service Details Page
// ================================

function ServiceDetailsPage() {
  const { serviceId } = useParams();

  const [service, setService] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [officeDetails, setOfficeDetails] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServiceDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Get all services
        const servicesResponse = await fetch(
          `${API_URL}/services`
        );

        if (!servicesResponse.ok) {
          throw new Error("Failed to load service");
        }

        const servicesData = await servicesResponse.json();

        const selectedService = servicesData.services.find(
          (item) => item.id === Number(serviceId)
        );

        if (!selectedService) {
          throw new Error("Service not found");
        }

        setService(selectedService);

        // Get required documents
        const documentsResponse = await fetch(
          `${API_URL}/services/${serviceId}/documents`
        );

        const documentsData =
          await documentsResponse.json();

        setDocuments(
          documentsData.required_documents || []
        );

        // Get office details
        const officeResponse = await fetch(
          `${API_URL}/services/${serviceId}/office`
        );

        const officeData =
          await officeResponse.json();

        setOfficeDetails(
          officeData.office_details || []
        );

        // Get instructions
        const instructionsResponse = await fetch(
          `${API_URL}/services/${serviceId}/instructions`
        );

        const instructionsData =
          await instructionsResponse.json();

        setInstructions(
          instructionsData.instructions || []
        );

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Unable to load service details.");
        setLoading(false);
      }
    };

    loadServiceDetails();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="message">
        Loading service details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  if (!service) {
    return (
      <div className="message">
        Service not found.
      </div>
    );
  }

  return (
    <section className="service-details-page">

      {/* Back Button */}
      <Link
        to="/"
        className="back-button"
      >
        ← Back to Services
      </Link>

      {/* Service Header */}
      <div className="service-page-header">

        <div>
          <h2>
            {service.name}
          </h2>

          <p className="department">
            Department: {service.department}
          </p>
        </div>

        {/* Official Website */}
        <a
          href={
            officialWebsites[service.name] ||
            "https://www.meseva.gov.in/"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="official-button"
        >
          Official Website
        </a>

      </div>

      <p className="description service-page-description">
        {service.description}
      </p>

      {/* Required Documents */}
      <div className="details-section">

        <h3>
          📄 Required Documents
        </h3>

        {documents.length > 0 ? (
          <ul>
            {documents.map((document) => (
              <li key={document.id}>

                <strong>
                  {document.document_name}
                </strong>

                {document.description && (
                  <span>
                    {" - "}
                    {document.description}
                  </span>
                )}

                {document.mandatory && (
                  <span className="mandatory">
                    {" "}
                    (Mandatory)
                  </span>
                )}

              </li>
            ))}
          </ul>
        ) : (
          <p>
            No required documents found for this service.
          </p>
        )}

      </div>

      {/* Office Details */}
      <div className="details-section">

        <h3>
          🏢 Office Details
        </h3>

        {officeDetails.length > 0 ? (
          <div className="office-list">

            {officeDetails.map((office) => (
              <div
                className="office-card"
                key={office.id}
              >

                <p>
                  <strong>Office Name:</strong>{" "}
                  {office.office_name}
                </p>

                <p>
                  <strong>Counter:</strong>{" "}
                  {office.counter}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {office.address}
                </p>

                <p>
                  <strong>Working Hours:</strong>{" "}
                  {office.working_hours}
                </p>

              </div>
            ))}

          </div>
        ) : (
          <p>
            No office details found for this service.
          </p>
        )}

      </div>

      {/* Instructions */}
      <div className="details-section">

        <h3>
          📋 Instructions
        </h3>

        {instructions.length > 0 ? (
          <ol className="instructions-list">

            {instructions.map((item) => (
              <li key={item.id}>
                {item.instruction}
              </li>
            ))}

          </ol>
        ) : (
          <p>
            No instructions found for this service.
          </p>
        )}

      </div>

    </section>
  );
}

// ================================
// Main App
// ================================

function App() {
  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="header-content">

          <Link
            to="/"
            className="logo-link"
          >
            <h1>GOVDOC</h1>
          </Link>

          <p>
            Government Document Information Framework
          </p>

        </div>
      </header>

      {/* Main */}
      <main className="main">

        <Routes>

          <Route
            path="/"
            element={<ServicesPage />}
          />

          <Route
            path="/services/:serviceId"
            element={<ServiceDetailsPage />}
          />

        </Routes>

      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2026 GOVDOC | Government Document Information Framework
        </p>
      </footer>

    </div>
  );
}

export default App;