export default function ResultModal({ result, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 id="modal-title" className="text-lg font-bold mb-2 mt-1">
          Analysis Details
        </h2>
        <p><strong>Resume:</strong> {result.resumeName}</p>
        <p><strong>Job Description:</strong> {result.jdName}</p>

        <div className="space-y-4 mt-4 text-sm">
          {[
            { label: "Skills", key: "Skills" },
            { label: "Job Role", key: "Job Role" },
            { label: "Education", key: "Education" },
            { label: "Experience", key: "Experience" },
          ].map((section, idx) => (
            <div key={idx}>
              <strong>{section.label} Match:</strong>{" "}
              {result[section.key]?.match_pct ?? "N/A"}%
              <p className="text-gray-600">Reason: {result[section.key]?.explanation}</p>
              <p className="text-gray-600">Resume Value: {result[section.key]?.resume_value}</p>
              <p className="text-gray-600">JD Value: {result[section.key]?.job_description_value}</p>
            </div>
          ))}

          <div>
            <strong>Overall Match:</strong> {result.OverallMatchPercentage}%
          </div>
          <div>
            <strong>AI Estimate:</strong> {result.AI_Generated_Estimate_Percentage}%
          </div>
          <div>
            <strong>Shortlisted:</strong> {result.shortlisted ? "Yes" : "No"}
          </div>
        </div>
      </div>
    </div>
  );
}