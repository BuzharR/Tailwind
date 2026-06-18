// Button.jsx — Reusable button component.
// Props: label (text), variant ("secondary" | "primary")

function Button({ label, variant = "secondary" }) {
    // Shared styles for all buttons
    const base = "mt-auto w-full rounded-full px-6 py-3.5 text-base font-medium cursor-pointer border-none transition-colors duration-200";

    // Variant-specific colours — each class maps to a component token in index.css
    const variants = {
        secondary: "bg-btn-secondary text-text-primary hover:bg-btn-secondary-hover",
        primary:   "bg-btn-primary text-white hover:bg-btn-primary-hover",
    };

    const className = `${base} ${variants[variant]}`;

    // #region agent log
    const payload = JSON.stringify({
        sessionId: '83596e',
        location: 'Button.jsx:render',
        message: 'button-render-props',
        data: { label, variant, className },
        hypothesisId: 'D',
        timestamp: Date.now(),
        runId: 'initial',
    });
    fetch('/__debug/log', { method: 'POST', body: payload }).catch(() => {});
    fetch('http://127.0.0.1:7900/ingest/93da8fb1-b228-4820-ae9e-45c0fcc6adea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '83596e' },
        body: payload,
    }).catch(() => {});
    // #endregion

    return (
        <button className={className}>
            {label}
        </button>
    );
}

export default Button;
