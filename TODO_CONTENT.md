# Content To Replace Before Launch

Running list — append to this every day a placeholder goes in.
Day 7 buffer starts here, not with a blind search through the codebase.

## Day 2 — Landing Page (`app/page.tsx`)
- [x] Hero photo — real photo uploaded via admin dashboard
- [ ] Scripture verse — currently "Jeremiah 29:11" placeholder text
- [x] Class motto — real: "Luminaire: The Lightbearers"

## Day 3 — Student Profiles
- [ ] Every student's `portrait_url` — real student data pending
- [ ] Every student's `testimony` — real student data pending
- [ ] Every student's `favorite_scripture` — real student data pending
- [ ] "Lionel Messi" test student row — delete once real data entry begins

## Day 4 — Gallery + Memory Wall
- [x] `PhotoLightbox.tsx` — framer-motion removed, CSS animation instead

## Day 5 — Letters
- [x] Test letters — created, verified, deleted. RLS confirmed working.

## Day 6 — Admin Dashboard
- [x] Moderation approve/reject — built, RLS bug fixed, confirm-on-reject added
- [x] Photo upload — built, batch upload added, edit/delete added

## Day 7 — Polish
- [x] Nav (slide-in from right, badge replaces text)
- [x] Fonts (Spectral/Work Sans + Abril Fatface display for hero title)
- [x] Buttons refined (btn-primary/secondary/hero, real press/shadow states)
- [x] Homepage gallery rotator (pulls from all photos, not capped)
- [x] Background decor (subtle blurred shapes)
- [x] Skeleton loading states (/students, /gallery, moderation panel)
- [x] Optimistic UI on approve/reject
- [x] Admin access confirmed secure (server-side auth check, not just page gate)

---

## Day 7 Checklist (don't skip this — do a fresh top-to-bottom pass)
- [ ] Real student data entered — this is the one true remaining blocker
- [ ] Scripture verse still placeholder — swap when final verse is chosen
- [ ] No literal placeholder strings remain (search repo for "placeholder",
      "TODO", "Lorem", "Goes Here")
- [ ] Every student profile has a photo and testimony (PRD requirement,
      not optional at launch — empty states look worse than missing features)
- [ ] Test on an actual phone, not desktop preview
