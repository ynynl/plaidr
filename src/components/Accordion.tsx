import React, { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="accordion">
      <button
        className="accordion-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="accordion-title">{title}</span>
        <svg
          className={`accordion-icon ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="accordion-content" data-expanded={isExpanded}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
