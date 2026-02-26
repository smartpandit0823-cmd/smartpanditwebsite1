# Puja Module - Sections & Fields

Puja add/edit form ke saare sections aur fields. Admin panel me `/admin/pujas/new` ya `/admin/pujas/[id]` pe ye dikhte hai.

---

## 1. Basic Info
| Field | Type | Description |
|-------|------|--------------|
| **name** | text | Puja ka naam (e.g. "Ganesh Puja") |
| **pujaType** | select | online / offline / temple |
| **shortDescription** | textarea | 2-3 line short desc |
| **longDescription** | textarea | Full description |
| **category** | text | e.g. Festivals, Griha Pravesh, Housewarming |

**Model me extra (form me abhi nahi):**
- `videoUrl` - YouTube/ video link
- `images` - multiple images array
- `slug` - auto from name (unique URL)

---

## 2. Puja Details (Model me hai, form me add karo)
| Field | Description |
|-------|-------------|
| **benefits** | array - puja ke benefits list |
| **whenToDo** | kab karna chahiye |
| **duration** | e.g. "2 hours" |
| **bestMuhurat** | auspicious time |
| **difficultyLevel** | easy / moderate / complex |
| **languagesAvailable** | array - Hindi, English, Marathi, etc. |
| **templeLocation** | agar temple type hai to address |

---

## 3. Samagri
| Field | Description |
|-------|-------------|
| **samagriList** | dynamic array - items list (diya, agarbatti, etc.) |
| **samagriIncluded** | boolean - samagri ham include karte hai ya nahi |

---

## 4. Packages (3 tiers)
Har package me:
| Field | Description |
|-------|-------------|
| **name** | basic / medium / premium |
| **price** | ₹ |
| **includedList** | array - kya kya included |
| **duration** | e.g. "2 hours" |
| **panditExperience** | e.g. "5+ years" |
| **extras** | extra info |
| **highlightDifference** | basic vs medium vs premium difference |

---

## 5. Discount (Model me hai, form me add karo)
| Field | Description |
|-------|-------------|
| **discountPercent** | 0-100 |
| **discountPrice** | flat ₹ off |
| **offerStart** | date |
| **offerEnd** | date |

---

## 6. Booking Settings (Model me hai, form me add karo)
| Field | Description |
|-------|-------------|
| **advanceAmount** | ₹ advance |
| **fullPaymentRequired** | boolean |
| **rescheduleAllowed** | boolean |
| **cancellationAllowed** | boolean |
| **cancellationPolicy** | text |
| **maxBookingsPerDay** | number (default 10) |

---

## 7. Flags
| Field | Description |
|-------|-------------|
| **popular** | checkbox |
| **featured** | checkbox |
| **trending** | checkbox |
| **panditRecommended** | checkbox |

---

## 8. SEO
| Field | Description |
|-------|-------------|
| **seoTitle** | meta title |
| **metaDescription** | meta description |
| **keywords** | array |

---

## 9. Status
| Value | Description |
|-------|-------------|
| **draft** | not visible to users |
| **active** | live on site |

---

## Abhi form me kya hai
- Basic Info: name, pujaType, shortDescription, longDescription, category
- Packages: price, duration, panditExperience, highlightDifference (basic/medium/premium)
- Status & SEO: status, featured, popular, trending, panditRecommended, seoTitle, metaDescription

## Add karna baki
- videoUrl, images
- benefits, whenToDo, duration, bestMuhurat, difficultyLevel
- samagriList, samagriIncluded
- discount (percent, price, dates)
- bookingSettings (advance, reschedule, cancellation, maxBookings)
- languagesAvailable, templeLocation
- packages.includedList, packages.extras
