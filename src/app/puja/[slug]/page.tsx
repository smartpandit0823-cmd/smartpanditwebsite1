import { notFound } from "next/navigation";
import { Check, X, Star, Clock, Users, MapPin, Globe, Video, FileText, CalendarCheck, AlertCircle, Navigation, Package, ShieldCheck, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PujaImageSlider } from "@/components/ui/PujaImageSlider";
import { StickyBookingBar } from "@/components/ui/StickyBookingBar";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { PujaReviews } from "@/components/puja/PujaReviews";
import { PujaBookingFlow } from "@/components/puja/PujaBookingFlow";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";
import Review from "@/models/Review";
import type { Metadata } from "next";

// ── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const puja = await Puja.findOne({ slug, status: "active" }).lean();
  if (!puja)
    return { title: "Puja Not Found | SmartPandit" };
  return {
    title: puja.seo?.seoTitle || `${puja.name} | SmartPandit`,
    description: puja.seo?.metaDescription || puja.shortDescription,
    keywords: puja.seo?.keywords?.join(", "),
  };
}

// ── Data fetch ──────────────────────────────────────────────────────────────

async function getPuja(slug: string) {
  await connectDB();
  const p = await Puja.findOne({ slug, status: "active" }).lean();
  if (!p) return null;

  const priceFrom = p.packages?.length
    ? Math.min(...p.packages.map((pk: { price: number }) => pk.price))
    : 0;

  return {
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    longDescription: p.longDescription,
    images: p.images || [],
    videoUrl: (p as { videoUrl?: string }).videoUrl || "",

    // Content
    benefits: p.benefits || [],
    whenToDo: p.whenToDo || "",
    whoShouldDo: (p as { whoShouldDo?: string }).whoShouldDo || "",
    process: (p as { process?: string[] }).process || [],
    samagriList: p.samagriList || [],
    samagriIncluded: p.samagriIncluded || false,
    faqs: (p as { faqs?: { question: string; answer: string }[] }).faqs || [],
    locationDetails: (p as { locationDetails?: string }).locationDetails || "",
    importantNotes: (p as { importantNotes?: string[] }).importantNotes || [],
    trustBadges: (p as { trustBadges?: { icon: string; label: string }[] }).trustBadges || [],
    eligibility: (p as { eligibility?: string }).eligibility || "",
    resultTimeline: (p as { resultTimeline?: string }).resultTimeline || "",
    preparationSteps: (p as { preparationSteps?: string[] }).preparationSteps || [],
    dosAndDonts: (p as { dosAndDonts?: { dos: string[]; donts: string[] } }).dosAndDonts || { dos: [], donts: [] },
    muhuratGuidance: (p as { muhuratGuidance?: string }).muhuratGuidance || "",
    panditDetails: (p as { panditDetails?: string }).panditDetails || "",
    reportIncluded: (p as { reportIncluded?: boolean }).reportIncluded || false,
    videoRecordingIncluded: (p as { videoRecordingIncluded?: boolean }).videoRecordingIncluded || false,

    // Meta
    duration: p.duration || "",
    category: p.category,
    pujaType: p.pujaType,
    difficultyLevel: p.difficultyLevel,
    languagesAvailable: p.languagesAvailable || [],
    maxPeopleAllowed: (p as { maxPeopleAllowed?: number }).maxPeopleAllowed || 0,
    templeLocation: (p as { templeLocation?: string }).templeLocation || "",
    templeName: (p as { templeName?: string }).templeName || "",
    googleMapsUrl: (p as { googleMapsUrl?: string }).googleMapsUrl || "",

    // Packages
    packages: (p.packages || []).map(
      (pk: { name: string; price: number; duration?: string; includedList?: string[]; highlightDifference?: string; panditExperience?: string }, i: number) => ({
        id: `pkg-${i}`,
        name: pk.name,
        price: pk.price,
        duration: pk.duration || p.duration || "",
        pandits: 1,
        samagri: p.samagriIncluded || false,
        benefits: pk.includedList || [],
        popular: i === 1,
        highlight: pk.highlightDifference || "",
        experience: pk.panditExperience || "",
      })
    ),

    // Booking settings
    bookingSettings: p.bookingSettings || {},
    priceFrom,
    averageRating: (p as { averageRating?: number }).averageRating ?? 4.8,
    totalBookings: (p as { totalBookings?: number }).totalBookings ?? 0,
  };
}

// ── Small UI helpers ─────────────────────────────────────────────────────────

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-warm-900 md:text-2xl">
        {icon}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-saffron-200/60 bg-white/85 p-4 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-saffron-200 bg-white px-3 py-1.5 text-sm text-warm-700">
      {label}
    </span>
  );
}

function YouTubeEmbed({ url }: { url: string }) {
  if (!url) return null;
  const videoId = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
  if (!videoId) return null;
  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-saffron-200 bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
        title="Puja video"
        className="h-full w-full"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function PujaDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const puja = await getPuja(slug);
  if (!puja) notFound();

  const faqItems = puja.faqs.map((f, i) => ({
    id: `faq-${i}`,
    question: f.question,
    answer: f.answer,
  }));

  // Default FAQs if none set
  if (!faqItems.length) {
    faqItems.push(
      { id: "faq-d1", question: `How long does ${puja.name} take?`, answer: puja.duration ? `This puja typically takes ${puja.duration}.` : "Duration varies by package. Please check package details above." },
      { id: "faq-d2", question: "Is samagri included?", answer: puja.samagriIncluded ? "Yes, samagri is included in the package price." : "Basic package is pandit-only. Higher packages may include samagri." },
      { id: "faq-d3", question: "Can I reschedule?", answer: puja.bookingSettings?.rescheduleAllowed ? `Yes, free reschedule up to ${(puja.bookingSettings as { rescheduleCutoffHours?: number }).rescheduleCutoffHours || 24} hours before.` : "Rescheduling is not available for this puja." },
      { id: "faq-d4", question: "What is the cancellation policy?", answer: (puja.bookingSettings as { cancellationPolicy?: string }).cancellationPolicy || "Full refund if cancelled 24 hours before. Contact support for assistance." },
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-32 pt-20 md:pt-20 md:pb-16">

      {/* ── Hero Image Slider ── */}
      <section className="relative overflow-hidden rounded-3xl">
        <PujaImageSlider images={puja.images} name={puja.name} />

        {/* Overlay info */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-3xl" />

        {/* Badge row */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-10">
          {puja.pujaType && (
            <span className="rounded-full bg-saffron-600 px-3 py-1 text-xs font-semibold text-white">
              {puja.pujaType === "temple" ? "🛕 Temple Puja" : puja.pujaType === "offline" ? "🏠 Home Puja" : "💻 Online Puja"}
            </span>
          )}
          {puja.totalBookings > 0 && (
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {puja.totalBookings}+ Booked
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white md:bottom-8 md:left-8 z-10">
          <h1 className="font-heading text-3xl font-bold leading-tight md:text-5xl">{puja.name}</h1>

          {/* Temple name + location */}
          {puja.templeName && (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gold-200">
              <MapPin size={14} className="shrink-0" />
              {puja.templeName}{puja.templeLocation ? `, ${puja.templeLocation}` : ""}
            </p>
          )}

          <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">{puja.shortDescription}</p>

          {/* Meta stats */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/90">
            {puja.averageRating > 0 && (
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-gold-400 text-gold-300" />
                {puja.averageRating.toFixed(1)}
              </span>
            )}
            {puja.duration && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {puja.duration}
              </span>
            )}
            {puja.languagesAvailable?.length > 0 && (
              <span className="flex items-center gap-1">
                <Globe size={14} />
                {puja.languagesAvailable.slice(0, 3).join(", ")}
              </span>
            )}
            {puja.maxPeopleAllowed > 0 && (
              <span className="flex items-center gap-1">
                <Users size={14} />
                Max {puja.maxPeopleAllowed} people
              </span>
            )}
            <span className="font-semibold">Starting {formatPrice(puja.priceFrom)}</span>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      {puja.trustBadges?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {puja.trustBadges.map((b, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-3 py-1.5 text-xs font-medium text-warm-800"
            >
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
          {puja.reportIncluded && (
            <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800">
              <FileText size={12} />Report Included
            </span>
          )}
          {puja.videoRecordingIncluded && (
            <span className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-800">
              <Video size={12} />Video Recording
            </span>
          )}
        </div>
      )}

      {/* ── Puja Includes (Trust Builder) ── */}
      <Section title="Puja Includes" icon={<Package size={20} className="text-saffron-600" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-saffron-200/60 bg-white/85 p-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-saffron-50 text-saffron-600"><Users size={18} /></div>
            <div><p className="text-sm font-semibold text-warm-900">Pandit Ji</p><p className="text-[11px] text-warm-500">Verified & Experienced</p></div>
          </div>
          {puja.samagriIncluded && (
            <div className="flex items-center gap-3 rounded-xl border border-green-200/60 bg-green-50/50 p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600"><Package size={18} /></div>
              <div><p className="text-sm font-semibold text-warm-900">Samagri</p><p className="text-[11px] text-warm-500">All items included</p></div>
            </div>
          )}
          <div className="flex items-center gap-3 rounded-xl border border-blue-200/60 bg-blue-50/50 p-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600"><ShieldCheck size={18} /></div>
            <div><p className="text-sm font-semibold text-warm-900">Sankalp</p><p className="text-[11px] text-warm-500">Proper vidhi</p></div>
          </div>
          {puja.videoRecordingIncluded && (
            <div className="flex items-center gap-3 rounded-xl border border-purple-200/60 bg-purple-50/50 p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 text-purple-600"><Video size={18} /></div>
              <div><p className="text-sm font-semibold text-warm-900">Video Proof</p><p className="text-[11px] text-warm-500">Full recording</p></div>
            </div>
          )}
          {puja.reportIncluded && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-200/60 bg-amber-50/50 p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600"><FileText size={18} /></div>
              <div><p className="text-sm font-semibold text-warm-900">Puja Report</p><p className="text-[11px] text-warm-500">Certificate provided</p></div>
            </div>
          )}
          <div className="flex items-center gap-3 rounded-xl border border-teal-200/60 bg-teal-50/50 p-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-600"><Truck size={18} /></div>
            <div><p className="text-sm font-semibold text-warm-900">Prasad</p><p className="text-[11px] text-warm-500">Delivered to you</p></div>
          </div>
        </div>
      </Section>

      {/* ── Booking Flow (Package → Date → Address → Pay) ── */}
      <section id="booking-section" className="mt-8 scroll-mt-20 rounded-3xl border-2 border-saffron-200 bg-gradient-to-br from-saffron-50/60 to-gold-50/60 p-1">
        <PujaBookingFlow
          pujaId={puja.id}
          pujaName={puja.name}
          pujaSlug={puja.slug}
          packages={puja.packages}
          bookingSettings={puja.bookingSettings}
          startingPrice={puja.priceFrom}
        />
      </section>

      {/* ── Long description ── */}
      {puja.longDescription && (
        <Section title="About this Puja">
          <Card>
            <p className="text-sm leading-relaxed text-warm-700 whitespace-pre-line">{puja.longDescription}</p>
          </Card>
        </Section>
      )}

      {/* ── Benefits ── */}
      {puja.benefits?.length > 0 && (
        <Section title="Benefits" icon={<span>✅</span>}>
          <div className="grid gap-3 sm:grid-cols-2">
            {puja.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-saffron-200/60 bg-white/85 p-3">
                <Check size={16} className="mt-0.5 shrink-0 text-saffron-600" />
                <p className="text-sm text-warm-700">{benefit}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Who Should Do ── */}
      {puja.whoShouldDo && (
        <Section title="Who Should Do This Puja" icon={<Users size={20} className="text-saffron-600" />}>
          <Card>
            <p className="text-sm leading-relaxed text-warm-700">{puja.whoShouldDo}</p>
          </Card>
        </Section>
      )}

      {/* ── Eligibility ── */}
      {puja.eligibility && (
        <Section title="Eligibility" icon={<CalendarCheck size={20} className="text-saffron-600" />}>
          <Card>
            <p className="text-sm leading-relaxed text-warm-700">{puja.eligibility}</p>
          </Card>
        </Section>
      )}

      {/* ── When to do ── */}
      {puja.whenToDo && (
        <Section title="When to Do" icon={<span>📅</span>}>
          <Card className="bg-gradient-to-r from-gold-50 to-saffron-50">
            <p className="text-sm leading-relaxed text-warm-700">{puja.whenToDo}</p>
          </Card>
        </Section>
      )}

      {/* ── Muhurat Guidance ── */}
      {puja.muhuratGuidance && (
        <Section title="Muhurat Guidance" icon={<span>🌙</span>}>
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <p className="text-sm leading-relaxed text-warm-700">{puja.muhuratGuidance}</p>
          </Card>
        </Section>
      )}

      {/* ── Process / How it Works ── */}
      {puja.process?.length > 0 && (
        <Section title="Process / How It Works" icon={<span>⚙️</span>}>
          <ol className="space-y-3">
            {puja.process.map((step, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-saffron-200/60 bg-white/85 p-3 text-sm text-warm-700">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-saffron-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* ── Preparation Steps ── */}
      {puja.preparationSteps?.length > 0 && (
        <Section title="Preparation Before Puja" icon={<span>🧘</span>}>
          <div className="space-y-2">
            {puja.preparationSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border border-gold-100 bg-gold-50/50 p-3">
                <span className="text-saffron-600 font-bold text-sm">{i + 1}.</span>
                <p className="text-sm text-warm-700">{step}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Do's & Don'ts ── */}
      {(puja.dosAndDonts?.dos?.length > 0 || puja.dosAndDonts?.donts?.length > 0) && (
        <Section title="Do's & Don'ts" icon={<span>📋</span>}>
          <div className="grid gap-4 sm:grid-cols-2">
            {puja.dosAndDonts?.dos?.length > 0 && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <h3 className="mb-3 font-semibold text-green-800">✅ Do's</h3>
                <ul className="space-y-2">
                  {puja.dosAndDonts.dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                      <Check size={14} className="mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {puja.dosAndDonts?.donts?.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <h3 className="mb-3 font-semibold text-red-800">❌ Don'ts</h3>
                <ul className="space-y-2">
                  {puja.dosAndDonts.donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <X size={14} className="mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}



      {/* ── Samagri ── */}
      {puja.samagriList?.length > 0 && (
        <Section title="Samagri List" icon={<span>🌿</span>}>
          {puja.samagriIncluded && (
            <p className="mb-3 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 border border-green-200">
              ✅ Samagri is included in the package price
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {puja.samagriList.map((item, i) => (
              <Chip key={i} label={item} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Pandit Details ── */}
      {puja.panditDetails && (
        <Section title="About Your Pandit" icon={<span>👨‍🦳</span>}>
          <Card>
            <p className="text-sm leading-relaxed text-warm-700">{puja.panditDetails}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {puja.reportIncluded && <Chip label="📄 Puja Report Included" />}
              {puja.videoRecordingIncluded && <Chip label="🎥 Video Recording Included" />}
            </div>
          </Card>
        </Section>
      )}

      {/* ── Location Details ── */}
      {(puja.locationDetails || puja.templeName || puja.templeLocation) && (
        <Section title="Location Details" icon={<MapPin size={20} className="text-saffron-600" />}>
          <Card>
            {puja.templeName && (
              <h3 className="mb-1 text-lg font-bold text-warm-900">🛕 {puja.templeName}</h3>
            )}
            {puja.templeLocation && (
              <p className="mb-2 flex items-center gap-1 text-sm font-medium text-saffron-700">
                <MapPin size={13} className="shrink-0" />
                {puja.templeLocation}
              </p>
            )}
            {puja.locationDetails && (
              <p className="text-sm leading-relaxed text-warm-700">{puja.locationDetails}</p>
            )}
            {puja.googleMapsUrl && (
              <a
                href={puja.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-saffron-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-saffron-600"
              >
                <Navigation size={16} />
                Get Direction
              </a>
            )}
          </Card>
        </Section>
      )}

      {/* ── Result Timeline ── */}
      {puja.resultTimeline && (
        <Section title="Result Timeline" icon={<span>⏳</span>}>
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200/60">
            <p className="text-sm leading-relaxed text-warm-700">{puja.resultTimeline}</p>
          </Card>
        </Section>
      )}

      {/* ── Languages ── */}
      {puja.languagesAvailable?.length > 0 && (
        <Section title="Languages Available" icon={<Globe size={20} className="text-saffron-600" />}>
          <div className="flex flex-wrap gap-2">
            {puja.languagesAvailable.map((lang, i) => (
              <Chip key={i} label={lang} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Important Notes ── */}
      {puja.importantNotes?.length > 0 && (
        <Section title="Important Notes" icon={<AlertCircle size={20} className="text-orange-500" />}>
          <div className="space-y-2">
            {puja.importantNotes.map((note, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3">
                <span className="mt-0.5 text-orange-500">⚠️</span>
                <p className="text-sm text-orange-800">{note}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Booking / Cancellation Info ── */}
      <Section title="Booking & Cancellation Info" icon={<span>📌</span>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <h3 className="mb-2 font-semibold text-warm-900">🔄 Reschedule</h3>
            <p className="text-sm text-warm-600">
              {puja.bookingSettings?.rescheduleAllowed
                ? `Free reschedule allowed up to ${(puja.bookingSettings as { rescheduleCutoffHours?: number }).rescheduleCutoffHours || 24} hours before.`
                : "Rescheduling is not available for this puja."}
            </p>
          </Card>
          <Card>
            <h3 className="mb-2 font-semibold text-warm-900">❌ Cancellation</h3>
            <p className="text-sm text-warm-600">
              {(puja.bookingSettings as { cancellationPolicy?: string }).cancellationPolicy ||
                (puja.bookingSettings?.rescheduleAllowed
                  ? "Cancellation allowed up to 24 hours before. Contact support."
                  : "Non-refundable after booking.")}
            </p>
          </Card>
        </div>
      </Section>

      {/* ── FAQ ── */}
      {faqItems.length > 0 && (
        <Section title="Frequently Asked Questions" icon={<span>❓</span>}>
          <FAQAccordion items={faqItems} />
        </Section>
      )}

      {/* ── YouTube Video ── */}
      {puja.videoUrl && (
        <Section title="Watch This Puja" icon={<Video size={20} className="text-red-500" />}>
          <YouTubeEmbed url={puja.videoUrl} />
          <p className="mt-2 text-xs text-warm-400 text-center">Watch a recorded ceremony of this puja</p>
        </Section>
      )}

      {/* ── Customer Reviews ── */}
      <Section title="Customer Reviews" icon={<Star size={20} className="fill-gold-400 text-gold-400" />}>
        <PujaReviews pujaId={puja.id} pujaName={puja.name} />
      </Section>

      {/* ── Final CTA Banner ── */}
      <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-saffron-500 to-red-600 p-8 text-center shadow-xl shadow-saffron-200/50">
        <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">Ready to Book {puja.name}?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-white/90">
          Join thousands of satisfied devotees. Our verified pandits will perform the authentic rituals for you.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-saffron-700 shadow-lg transition-transform hover:scale-105 hover:bg-gold-50 w-full sm:w-auto">
            Book Puja Now
          </button>
          <button className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 w-full sm:w-auto">
            Talk to Expert
          </button>
        </div>
      </section>

      {/* ── Sticky booking bar (Mobile mostly) ── */}
      <StickyBookingBar
        startingPrice={puja.priceFrom}
        ctaText="Book Now"
        slug={puja.slug}
      />
    </div>
  );
}
