export const metadata = {
  title: "Cancellation Policy",
  description: "SmartPandit cancellation and refund policy.",
};

export default function CancellationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-2xl font-bold text-warm-900">
        Cancellation Policy
      </h1>
      <p className="mt-2 text-sm text-warm-600">
        Last updated: {new Date().toLocaleDateString("en-IN")}
      </p>
      <div className="mt-8 space-y-6 rounded-3xl border border-saffron-200/70 bg-white/85 p-6 text-warm-700">
        <section>
          <h2 className="font-heading text-lg font-semibold text-warm-900">
            Free Cancellation
          </h2>
          <p>
            Cancel up to 24 hours before your scheduled booking for a full refund.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-semibold text-warm-900">
            Rescheduling
          </h2>
          <p>
            Free rescheduling up to 24 hours before. Contact support for changes
            within 24 hours.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-semibold text-warm-900">
            Contact
          </h2>
          <p>For cancellation requests: support@smartpandit.in or WhatsApp</p>
        </section>
      </div>
    </div>
  );
}
