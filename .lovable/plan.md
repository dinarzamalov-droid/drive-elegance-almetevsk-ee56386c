

## Plan: Complete Site Design — Logo, Handover Section, Navigation

Based on the uploaded branding images (orange 3D Drive logo on dark/white backgrounds) and the previous approved plan, here are the remaining implementation tasks.

### Task 1: Add Logo to Navbar and Footer

Copy `IMG_7120-2.png` (orange 3D Drive logo on white/transparent background) to `src/assets/logo.png`. In both `Navbar.tsx` and `Footer.tsx`, replace the text-based logo (`<span>3D</span><span> Drive</span>`) with an `<img>` tag importing the asset. Navbar logo height ~36px, Footer logo height ~32px.

### Task 2: Create HandoverSection (Порядок выдачи и осмотра)

Create `src/components/HandoverSection.tsx` with:
- 5 numbered steps (Подготовка, Встреча, Фотофиксация, Акт приема-передачи, Возврат)
- "Ограничения при аренде" block (5 rules: no third-party drivers, no commercial use, no racing, no illegal activity, no smoking/pets)
- Uses `AnimatedSection`/`AnimatedItem`, same card styling as other sections

Add to `Index.tsx` after `HowItWorksSection`.

### Task 3: Update Navigation Links

Add to `navItems` in `Navbar.tsx` and `footerLinks` in `Footer.tsx`:
- `{ label: "Сертификаты", href: "#certificates" }`
- `{ label: "Клуб", href: "#club" }`

Verify `ClubCardsSection` has `id="club"` on its section element.

### Files Changed

| File | Action |
|------|--------|
| `src/assets/logo.png` | Copy from upload |
| `src/components/Navbar.tsx` | Logo image + nav links |
| `src/components/Footer.tsx` | Logo image + footer links |
| `src/components/HandoverSection.tsx` | Create new |
| `src/pages/Index.tsx` | Add HandoverSection |
| `src/components/ClubCardsSection.tsx` | Add `id="club"` if missing |

