# 🐞 Buq - Task & Bug Tracker Interface

A fully responsive, feature-rich bug/task tracker built with **Next.js**, **Redux**, **Clerk**, and **ShadCN UI**. This application allows developers and managers to collaborate efficiently on task/bug tracking, closure workflows, and time management — all with clean UI, light/dark mode support, and insightful charts.

---

## 🔥 Features

### 🧑‍💻 User Authentication & Role System
- Login via **Clerk** (customizable to mock-auth for testing).
- Two roles: **Developer** and **Manager**.
- Role-based access and UI behavior.

### 📊 Dashboard
- Developers: View and manage their assigned tasks/bugs.
- Managers: View all tasks/bugs (open/closed).
- **Trends chart**: Line graph showing concurrent tasks worked on each day.
- **Time tracking chart**: Bar graph showing time spent by each user on each task.

### 📝 Task/Bug Creation & Management
- Create, edit, and delete tasks/bugs.
- Fields: Title, Description, Priority, Status, Assignee, Important Dates, etc.
- Assign tasks to users.
- Filtering & sorting by **priority**, **status**, and **type**.
- Status badge UI with icons.
- Closure workflow:
  - Developer marks bugs as "Closed".
  - Manager can **approve** or **re-open** (Pending Approval state until actioned).

### ⏱ Time Tracker
- Start/stop timer on each task.
- Total time spent is automatically tracked.
- Managers can see time logs for all users.
- Timer status shown on task page.

### 🎨 UI/UX & Styling
- Built with **ShadCN UI + Tailwind CSS**.
- Default styling, badges, cards, tooltips, inputs, and modals.
- Fully responsive — optimized for **desktop and mobile**.
- Light/Dark mode support.

---

## 📈 Graphs Included

- **Concurrent Tasks Trend Chart** – Line chart visualizing task concurrency per day.
- **Time Spent by User Chart** – Bar chart showing time spent by each user on different tasks.
- More charts can easily be added using `Recharts`.

---

## 🛠 Tech Stack

| Category            | Tech                        |
|---------------------|-----------------------------|
| Framework           | [Next.js](https://nextjs.org) |
| Language            | TypeScript                  |
| State Management    | [Redux Toolkit](https://redux-toolkit.js.org) |
| Auth                | [Clerk](https://clerk.dev) |
| UI Components       | [ShadCN UI](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com) |
| Charts              | [Recharts](https://recharts.org) |
| Icons               | [Lucide React](https://lucide.dev) |
| Deployment          | [Vercel](https://vercel.com) |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Dev Server
```bash
npm run dev
```