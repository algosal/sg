import React from "react";
import Navbar from "../Navbar";
import "./Corporate.css";

const Company = ({ title, description, subCompanies }) => (
  <div className="company-block">
    <h3 className="company-title">{title}</h3>
    {description && <p className="company-description">{description}</p>}
    {subCompanies && (
      <div className="company-sub">
        {subCompanies.map((sub, i) => (
          <Company key={i} {...sub} />
        ))}
      </div>
    )}
  </div>
);

const Corporate = () => {
  return (
    <div className="corporate-container">
      <Navbar />

      <header className="corporate-header">Corporate Structure</header>

      <main className="corporate-content">
        <Company
          title="FinSln Holdings"
          description="Main holding company that owns all subsidiaries."
          subCompanies={[
            {
              title: "FinSln LLC",
              description:
                "Financial and accounting solutions across industries.",
            },
            {
              title: "FinPwr LLC",
              description: "Hedge fund and financial leverage operations.",
            },
          ]}
        />

        <Company
          title="Conscience Neurons LLC"
          description="Neural Networks and AI systems integration."
        />

        <Company
          title="Mellow Enclave LLC"
          description="The Billionaires Club: Lifestyle and high net-worth network."
        />

        <Company
          title="Suit De Vital LLC"
          description="Elite custom suiting brand for professionals."
        />

        <Company
          title="THC & Wellness Division"
          subCompanies={[
            {
              title: "Budson Valley Smokehouse",
              description: "THC Dispensary.",
            },
            { title: "420 CannaCore LLC", description: "THC Dispensary." },
            { title: "Floating Koala LLC", description: "THC Dispensary." },
            {
              title: "Wellness & Beyond",
              description: "Wellness product line (Sole Proprietorship).",
            },
          ]}
        />

        <Company
          title="AG App"
          subCompanies={[
            {
              title: "Alba Gold Systems LLC",
              description: "Core software development company.",
            },
            {
              title: "Alba Points LLC",
              description: "Blockchain-style point system for AG App/token.",
            },
          ]}
        />

        <Company
          title="Data & Retail Ops Division"
          subCompanies={[
            {
              title: "Savvy Inventory LLC",
              description:
                "Retail inventory management and POS optimization tools.",
            },
            {
              title: "Financial Data LLC",
              description:
                "Analytics, dashboards, and reporting systems for decision-making.",
            },
          ]}
        />

        <Company
          title="Mergers and Acquisitions for Salman Saeed LLC"
          description="Corporate expansion and business acquisitions engine."
        />

        <Company
          title="Salman Saeed Corporate Solutions"
          description="Original entity, IPO-oriented (Sole Proprietorship)."
        />
      </main>
    </div>
  );
};

export default Corporate;
