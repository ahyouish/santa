# 🎅 Santa Wish Management System

A Christmas Wish Management System built with **Next.js** and **React**, featuring a **deep red, cream, and gold** palette, custom Santa hand cursor, and end-to-end synchronized state across all portals.

---

## 🌟 Features & Portals

### 1. 🏠 Central Dashboard Hub (`/`)
- Portal switcher to navigate between **Santa Admin**, **Child Wish Letter**, and **Elf Delivery**.
- High-level North Pole summary metrics (*Total Wishes*, *Pending Review*, *Approved for Workshop*, *Delivered*).

### 2. 🎅 Santa Admin Dashboard (`/santa`)
- **Sidebar**: Santa's Portal brand, Wishes (with pending counter), Naughty List, Deliveries, and Profile.
- **Main Area**: Wish Requests table with name search, filter tabs (*All*, *Pending*, *Approved*, *Rejected*), child avatars, and wish descriptions.
- **Right Panel**: Selected wish details with child profile, Good/Naughty list badge, wish quote card, automated AI safety evaluation (*"Safe — No harmful or inappropriate content detected"*), and solid **Approve** (green) & **Reject** (red) decision buttons.

### 3. 💌 Child Wish Portal (`/child`)
- Letter form for children to submit wishes, select age, share good deeds, choose gift categories, and pick their avatar.
- Real-time Elf Scout AI safety validation.
- Live status tracking showing whether their letter is Under Review, Approved, or in the Workshop.

### 4. 🛷 Elf Sleigh & Delivery Ops (`/delivery`)
- 4-Stage Kanban workshop pipeline:
  1. 🔨 **Toy Workshop** (Assembly)
  2. 🎁 **Gift Wrapping** (Packaging)
  3. 🛷 **Loaded on Sleigh** (Stowed for flight)
  4. 🎄 **Delivered** (Under the Christmas tree)
- One-click stage advancement with instant status synchronization.

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/ahyouish/santa.git
cd santa
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React](https://react.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Deep Red, Cream, and Gold festive design system)
- **Cursor**: Custom calibrated Santa Claus glove pointer
