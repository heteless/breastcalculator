export default function FAQ({ questions }) {
  if (!questions || questions.length === 0) return null;

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {questions.map((q, i) => (
          <details key={i} className="faq-item">
            <summary className="faq-question">{q.question}</summary>
            <div className="faq-answer">{q.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}