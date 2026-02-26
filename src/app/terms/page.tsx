export const metadata = {
  title: "Terms of Service",
  description: "SmartPandit terms of service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-2xl font-bold text-warm-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-warm-600">
        Last updated: {new Date().toLocaleDateString("en-IN")}
      </p>
      <div className="mt-8 space-y-6 rounded-3xl border border-saffron-200/70 bg-white/85 p-6 text-warm-700">
        <section>
          <h2 className="font-heading text-lg font-semibold text-warm-900">
            1. Acceptance
          </h2>
          <p>
            By using SmartPandit, you agree to these terms. Please read them carefully.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-semibold text-warm-900">
            2. Services
          </h2>
          <p>
            SmartPandit connects you with verified pandits for puja, astrology consultations,
            and related services. We facilitate booking; the actual service is provided
            by our verified partners.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-semibold text-warm-900">
            3. Cancellation
          </h2>
          <p>
            Please refer to our Cancellation Policy for refund and rescheduling terms.
          </p>
        </section>
      </div>
    </div>
  );
}
