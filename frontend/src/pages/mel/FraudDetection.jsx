import React, { useState } from "react";

const FraudDetection = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    reason: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simplified fraud detection logic
  const detectFraud = (reason) => {
    // List of suspicious keywords
    const suspiciousKeywords = [
      "fake",
      "emergency",
      "shopping",
      "break",
      "certificate",
    ];

    // Convert reason to lowercase for case-insensitive matching
    const lowerCaseReason = reason.toLowerCase();

    // Check if any suspicious keyword is present in the reason
    const isFraudulent = suspiciousKeywords.some((keyword) =>
      lowerCaseReason.includes(keyword)
    );

    return isFraudulent ? "Fraudulent" : "Genuine";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a delay for processing
    setTimeout(() => {
      const prediction = detectFraud(formData.reason);
      setResult(prediction);
      setLoading(false);
    }, 1000); // 1-second delay to simulate processing
  };

  return (
    <div className="fraud-detection">
      <h2>Leave Application</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>From:</label>
          <input
            type="date"
            name="from"
            value={formData.from}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>To:</label>
          <input
            type="date"
            name="to"
            value={formData.to}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Reason for Leave:</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default FraudDetection;