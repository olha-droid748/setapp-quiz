import { APPS, TAG_MAP } from './data';

// ── RECOMMENDATION ENGINE ────────────────────────────────────────────────────
// Always returns exactly 5 apps:
//   Slot 1   → CleanMyMac (always)
//   Slot 2   → best matching app from featured 5 (Paste, iStat Menus, Downie, CleanShot X, Bartender)
//   Slots 3-5 → best matching apps from the full catalog

export function recommend(q1, q2, q3) {
  const allTags = new Set();
  [...q1, ...q2, ...q3].forEach((a) =>
    (TAG_MAP[a] || []).forEach((t) => allTags.add(t))
  );

  const scored = APPS.map((a) => ({
    ...a,
    score: a.tags.filter((t) => allTags.has(t)).length,
  })).sort((a, b) => b.score - a.score);

  // Slot 1: CleanMyMac (always)
  const cleanMyMac = APPS.find((a) => a.name === 'CleanMyMac');
  const seen = new Set(['CleanMyMac']);
  const stack = [{ ...cleanMyMac, score: 0 }];

  // Slot 2: best matching featured app (excluding CleanMyMac)
  const featured = scored.find((a) => a.required && a.name !== 'CleanMyMac');
  if (featured) { seen.add(featured.name); stack.push(featured); }

  // Slots 3-5: best matching apps from full catalog
  for (const a of scored) {
    if (stack.length >= 5) break;
    if (!seen.has(a.name)) { seen.add(a.name); stack.push(a); }
  }

  return stack.slice(0, 5);
}

// ── PAIN NARRATIVE ────────────────────────────────────────────────────────────
// Builds a conversational 1–3 sentence description based on answers

export function buildPainNarrative(q2, q3) {
  const all = [...q2, ...q3];
  const has = (k) => all.includes(k);
  const parts = [];

  if (has("Many things — my Mac feels slow") || has("My Mac is kind of a mess"))
    parts.push("Your Mac is carrying a lot — and it's starting to show.");
  if (has("Staying focused and avoiding distractions") || has("I get distracted or overwhelmed easily"))
    parts.push("Staying focused takes more effort than it should.");
  if (has("Switching between apps") || has("I have too many tabs open"))
    parts.push("Jumping between apps and tabs is eating your day.");
  if (has("Repeating the same small tasks") || has("I repeat the same actions every day"))
    parts.push("You're doing the same things manually over and over.");
  if (has("Managing files (screenshots, PDFs, etc.)") || has("I lose track of files, notes, or info"))
    parts.push("Files and information pile up faster than you can organise them.");
  if (has("Taking notes or writing up meetings"))
    parts.push("Meeting notes always feel like a chore after the fact.");
  if (has("Writing (emails, posts, messages)"))
    parts.push("Writing the same types of messages is taking too long.");
  if (has("Keeping track of tasks or to-dos") || has("I often forget tasks"))
    parts.push("Tasks slip through the cracks — not because you're careless, but because there's just too much.");
  if (has("Finding or organizing things"))
    parts.push("Finding things takes longer than doing the actual work.");
  if (has("I feel busy, but not productive"))
    parts.push("You're busy all day but the important stuff still doesn't move forward.");

  if (parts.length === 0)
    parts.push("Your workflow has a few friction points that quietly add up over the day.");

  return parts.slice(0, 3).join(" ");
}