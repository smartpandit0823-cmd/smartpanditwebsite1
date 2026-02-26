export const metadata = {
  title: "Privacy Policy",
  description: "SmartPandit privacy policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-2xl font-bold text-warm-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-warm-600">
        Last updated: {new Date().toLocaleDateString("en-IN")}
      </p>
      <div className="mt-8 space-y-6 rounded-3xl border border-saffron-200/70 bg-white/85 p-6 text-warm-700">
        <section>
          <h2 className="font-heading text-lg font-semibold text-warm-900">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide when booking: name, phone, email, address.
            We also collect payment information processed securely by our partners.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-semibold text-warm-900">
            2. How We Use Your Information
          </h2>
          <p>
            We use your information to process bookings, send confirmations, and improve
            our services. We do not sell your data to third parties.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-semibold text-warm-900">
            3. Contact
          </h2>
          <p>For privacy concerns, email us at support@smartpandit.in</p>
        </section>
      </div>
    </div>
  );
}
