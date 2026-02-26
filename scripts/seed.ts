/**
 * SmartPandit Seed Script
 * Run: npx tsx scripts/seed.ts
 */
import dotenv from "dotenv";
import path from "path";

// Load .env.local first (Next.js convention), then .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Puja from "../src/models/Puja";
import Product from "../src/models/Product";
import Pandit from "../src/models/Pandit";
import Customer from "../src/models/Customer";
import AdminUser from "../src/models/AdminUser";
import PujaRequest from "../src/models/PujaRequest";
import AstrologyRequest from "../src/models/AstrologyRequest";
import AstroService from "../src/models/AstroService";
import AstroRequest from "../src/models/AstroRequest";
import User from "../src/models/User";
import Booking from "../src/models/Booking";
import Offer from "../src/models/Offer";
import Banner from "../src/models/Banner";
import Slider from "../src/models/Slider";
import Coupon from "../src/models/Coupon";
import FestivalCalendar from "../src/models/FestivalCalendar";
import TeamMember from "../src/models/TeamMember";
import AnalyticsEvent from "../src/models/AnalyticsEvent";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  // Admin credentials live only in DB (no env). Defaults below.
  const adminEmail = "admin@smartpandit.com";
  const adminPassword = "Admin@123456";

  const hashed = await bcrypt.hash(adminPassword, 12);
  let admin = await AdminUser.findOne({ email: adminEmail });
  if (!admin) {
    admin = await AdminUser.create({
      name: "Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
    });
    console.log("Created admin:", adminEmail);
  } else {
    await AdminUser.updateOne({ email: adminEmail }, { password: hashed, isActive: true });
    console.log("Admin password reset:", adminEmail);
  }

  const pujaIds: mongoose.Types.ObjectId[] = [];
  const pujasData = [
    { name: "Ganesh Puja", category: "Festivals", slug: "ganesh-puja", packages: [{ name: "basic", price: 999 }, { name: "medium", price: 1999 }, { name: "premium", price: 3999 }] },
    { name: "Satyanarayan Puja", category: "Festivals", slug: "satyanarayan-puja", packages: [{ name: "basic", price: 1499 }, { name: "medium", price: 2499 }, { name: "premium", price: 4999 }] },
    { name: "Griha Pravesh Puja", category: "Housewarming", slug: "griha-pravesh-puja", packages: [{ name: "basic", price: 2999 }, { name: "medium", price: 4999 }, { name: "premium", price: 9999 }] },
  ];

  for (const p of pujasData) {
    let puja = await Puja.findOne({ slug: p.slug });
    if (!puja) {
      puja = await Puja.create({
        name: p.name,
        slug: p.slug,
        shortDescription: `${p.name} brings peace and prosperity.`,
        longDescription: `Perform ${p.name} with our verified pandits. Includes samagri, video call support, and certificate.`,
        category: p.category,
        pujaType: "online",
        status: "active",
        packages: p.packages.map((pk) => ({ ...pk, includedList: [], duration: "2 hours", panditExperience: "5+ years", extras: "", highlightDifference: "" })),
        benefits: ["Peace of mind", "Auspicious beginning"],
        samagriList: [],
        samagriIncluded: true,
        maxBookingsPerDay: 10,
        bookingSettings: { advanceAmount: 500, fullPaymentRequired: false, rescheduleAllowed: true, cancellationAllowed: true, cancellationPolicy: "24 hours" },
        seo: { seoTitle: p.name, metaDescription: `Book ${p.name} online`, keywords: [p.name] },
      });
      pujaIds.push(puja._id);
      console.log("Created puja:", p.name);
    }
  }

  const productData = [
    { name: "Rudraksha Mala", slug: "rudraksha-mala", category: "Accessories", sellingPrice: 499, mrp: 699 },
    { name: "Brass Ganesh Idol", slug: "brass-ganesh-idol", category: "Idols", sellingPrice: 899, mrp: 1200 },
    { name: "Sandalwood Incense", slug: "sandalwood-incense", category: "Incense", sellingPrice: 149, mrp: 199 },
    { name: "Copper Bell", slug: "copper-bell", category: "Puja Items", sellingPrice: 299, mrp: 399 },
    { name: "Panchamrit", slug: "panchamrit", category: "Prasad", sellingPrice: 199, mrp: 249 },
  ];

  for (const pd of productData) {
    const exists = await Product.findOne({ slug: pd.slug });
    if (!exists) {
      await Product.create({
        ...pd,
        shortDescription: `Authentic ${pd.name} for puja.`,
        fullDescription: `High quality ${pd.name} for your spiritual practice.`,
        mainImage: "https://placehold.co/400x400?text=Product",
        images: [],
        pricing: { sellingPrice: pd.sellingPrice, mrp: pd.mrp, discount: Math.round(((pd.mrp - pd.sellingPrice) / pd.mrp) * 100), gst: 0 },
        inventory: { stock: 50, sku: `SP-${Date.now()}`, inStock: true, lowStockThreshold: 5 },
        variants: {},
        shipping: { deliveryCharge: 49, freeShipping: pd.sellingPrice >= 500, deliveryDays: 5 },
        seo: { seoTitle: pd.name, metaDescription: `Buy ${pd.name}`, keywords: [] },
        status: "published",
      });
      console.log("Created product:", pd.name);
    }
  }

  const panditIds: mongoose.Types.ObjectId[] = [];
  const panditsData = [
    { name: "Pandit Ramesh Sharma", email: "ramesh@smartpandit.com", phone: "+919876543210", city: "Pune", state: "Maharashtra" },
    { name: "Pandit Suresh Joshi", email: "suresh@smartpandit.com", phone: "+919876543211", city: "Mumbai", state: "Maharashtra" },
  ];

  for (const pd of panditsData) {
    let pandit = await Pandit.findOne({ email: pd.email });
    if (!pandit) {
      pandit = await Pandit.create({
        ...pd,
        specializations: ["Ganesh Puja", "Satyanarayan Puja"],
        languagesSpoken: ["Hindi", "Marathi"],
        experience: 10,
        verificationStatus: "verified",
        status: "active",
      });
      panditIds.push(pandit._id);
      console.log("Created pandit:", pd.name);
    }
  }

  let customer = await Customer.findOne({ email: "demo@example.com" });
  if (!customer) {
    customer = await Customer.create({
      name: "Demo User",
      email: "demo@example.com",
      phone: "+919876543212",
      status: "active",
    });
    console.log("Created customer");
  }

  const statuses = ["requested", "assigned", "inprogress", "completed", "submitted"];
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const exists = await PujaRequest.findOne({ date, "userInfo.email": "demo@example.com" });
    if (!exists && pujaIds[0]) {
      await PujaRequest.create({
        userId: customer._id,
        pujaId: pujaIds[i % pujaIds.length],
        packageName: ["basic", "medium", "premium"][i % 3],
        date,
        time: "10:00 AM",
        userInfo: { name: "Demo User", phone: "+919876543212", email: "demo@example.com", address: "123 Sample St" },
        paymentStatus: i < 3 ? "paid" : "pending",
        amount: 999 + i * 500,
        status: statuses[i],
        assignedPanditId: i >= 1 ? panditIds[0] : undefined,
        statusHistory: [{ status: statuses[i], changedAt: new Date() }],
      });
    }
  }
  console.log("Created puja requests");

  for (let i = 0; i < 2; i++) {
    const exists = await AstrologyRequest.findOne({ name: "Demo User", email: "demo@example.com" });
    if (!exists) {
      await AstrologyRequest.create({
        userId: customer._id,
        name: "Demo User",
        phone: "+919876543212",
        email: "demo@example.com",
        birthDate: new Date("1990-01-15"),
        birthPlace: "Pune",
        problemCategory: "Career",
        priority: i === 0 ? "normal" : "urgent",
        sessionType: 30,
        amount: 999,
        status: i === 0 ? "completed" : "requested",
        paymentStatus: i === 0 ? "paid" : "pending",
        statusHistory: [{ status: i === 0 ? "completed" : "requested", changedAt: new Date() }],
      });
    }
  }
  console.log("Created astrology requests");

  // AstroService (new astrology flow)
  const astroServices = [
    { name: "General Consultation", slug: "general-consultation", sessionTypes: [{ minutes: 15, price: 299 }, { minutes: 30, price: 499 }, { minutes: 60, price: 899 }] },
    { name: "Career & Finance", slug: "career-finance", sessionTypes: [{ minutes: 30, price: 599 }, { minutes: 60, price: 999 }] },
    { name: "Love & Marriage", slug: "love-marriage", sessionTypes: [{ minutes: 30, price: 499 }, { minutes: 60, price: 899 }] },
  ];
  for (const s of astroServices) {
    if (!(await AstroService.findOne({ slug: s.slug }))) {
      await AstroService.create({ ...s, description: `Get expert astrological guidance for ${s.name.toLowerCase()}.` });
      console.log("Created AstroService:", s.name);
    }
  }

  // User (OTP auth) + sample AstroRequest
  let otpUser = await User.findOne({ phone: "+919876543213" });
  if (!otpUser) {
    otpUser = await User.create({ phone: "+919876543213", name: "OTP Demo User", city: "Pune" });
    console.log("Created OTP user");
  }
  if (await AstroRequest.countDocuments() === 0 && otpUser) {
    await AstroRequest.create({
      userId: otpUser._id,
      serviceType: "General Consultation",
      birthDate: new Date("1990-05-20"),
      birthPlace: "Mumbai",
      problemCategory: "Career",
      sessionType: 30,
      amount: 499,
      status: "paid",
      paymentStatus: "paid",
      statusHistory: [{ status: "paid", at: new Date() }],
    });
    console.log("Created sample AstroRequest");
  }

  // Sample Booking (new puja flow)
  if (await Booking.countDocuments() === 0 && pujaIds[0] && otpUser) {
    await Booking.create({
      userId: otpUser._id,
      pujaId: pujaIds[0],
      package: "basic",
      date: new Date(),
      time: "10:00 AM",
      address: "123 Sample Address",
      status: "requested",
      paymentStatus: "pending",
      amount: 999,
      statusHistory: [{ status: "requested", at: new Date() }],
    });
    console.log("Created sample Booking");
  }

  // Offers
  const offersData = [
    { title: "Puja Special 10% Off", type: "puja" as const, discount: 10, discountType: "percent" as const },
    { title: "Store Flat ₹200 Off", type: "store" as const, discount: 200, discountType: "flat" as const },
  ];
  for (const o of offersData) {
    if (!(await Offer.findOne({ title: o.title }))) {
      await Offer.create({ ...o, description: o.title, active: true });
      console.log("Created offer:", o.title);
    }
  }

  // Banners
  if (await Banner.countDocuments() === 0) {
    await Banner.create({ title: "Home Banner", image: "https://placehold.co/1200x400?text=Banner", position: "home", status: "active", order: 0 });
    console.log("Created sample banner");
  }

  // Sliders
  const slidersData = [
    { title: "Welcome to SmartPandit", image: "https://placehold.co/1200x400?text=Slider1", link: "/puja", order: 0 },
    { title: "Book Pujas Online", image: "https://placehold.co/1200x400?text=Slider2", link: "/puja", order: 1 },
  ];
  for (const s of slidersData) {
    if (!(await Slider.findOne({ title: s.title }))) {
      await Slider.create({ ...s, active: true });
      console.log("Created slider:", s.title);
    }
  }

  const couponsData = [
    { code: "WELCOME10", type: "percent", value: 10, usageLimit: 100 },
    { code: "FLAT200", type: "flat", value: 200, minOrderAmount: 1000, usageLimit: 50 },
  ];

  for (const c of couponsData) {
    const exists = await Coupon.findOne({ code: c.code });
    if (!exists) {
      await Coupon.create({
        ...c,
        status: "active",
        applicableTo: "all",
      });
      console.log("Created coupon:", c.code);
    }
  }

  const festivalData = [
    { name: "Diwali", date: new Date("2025-10-20"), type: "festival" },
    { name: "Makar Sankranti", date: new Date("2026-01-14"), type: "festival" },
  ];

  for (const f of festivalData) {
    const exists = await FestivalCalendar.findOne({ name: f.name });
    if (!exists) {
      await FestivalCalendar.create({ ...f, isAuspicious: true });
      console.log("Created festival:", f.name);
    }
  }

  // Team Members
  const teamData = [
    { name: "Pandit Ramesh Sharma", phone: "+919876543210", role: "pandit" as const, skills: ["Ganesh Puja", "Satyanarayan", "Griha Pravesh"], area: "Kothrud", city: "Pune", state: "Maharashtra", experience: 12 },
    { name: "Pandit Suresh Joshi", phone: "+919876543211", role: "pandit" as const, skills: ["Havan", "Wedding Puja", "Nav Graha Shanti"], area: "Baner", city: "Pune", state: "Maharashtra", experience: 8 },
    { name: "Jyotish Acharya Mohan", phone: "+919876543214", role: "astrologer" as const, skills: ["Kundli", "Prashna Kundli", "Vastu"], area: "Shivajinagar", city: "Pune", state: "Maharashtra", experience: 15 },
    { name: "Priya Support", phone: "+919876543215", role: "support" as const, skills: ["Customer Care", "Hindi", "English"], area: "Remote", city: "Pune", state: "Maharashtra", experience: 3 },
  ];
  for (const t of teamData) {
    if (!(await TeamMember.findOne({ phone: t.phone }))) {
      await TeamMember.create({ ...t, status: "active", verificationStatus: "verified", languagesSpoken: ["Hindi", "Marathi"] });
      console.log("Created team member:", t.name);
    }
  }

  // Sample Analytics Events
  if (await AnalyticsEvent.countDocuments() === 0) {
    const events = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const visitors = 10 + Math.floor(Math.random() * 40);
      for (let j = 0; j < visitors; j++) {
        const sessionId = `sess_${i}_${j}_${Date.now()}`;
        events.push({ event: "session_start", sessionId, page: "/", device: j % 2 === 0 ? "mobile" : "desktop", createdAt: date });
        events.push({ event: "page_view", sessionId, page: ["/", "/puja", "/store", "/astrology"][j % 4], createdAt: date });
      }
    }
    await AnalyticsEvent.insertMany(events);
    console.log("Created sample analytics events");
  }

  console.log("\nSeed completed successfully!");
  console.log("Admin login (stored in DB only):", adminEmail, "/", adminPassword);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
