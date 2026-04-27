// src/lib/constants.ts
export const APP_NAME = "HocCungEm"
export const APP_SLOGAN = "AI không làm bài hộ. AI học cùng em."
export const AI_PERSONA_NAME = "Cô Mây"

export const ROUTES = {
  home: "/",
  login: "/login",
  teacher: {
    dashboard: "/teacher/dashboard",
    insights: "/teacher/insights",
    reviews: "/teacher/reviews",
    topics: "/teacher/topics",
  },
  parent: {
    home: "/parent/home",
    upload: "/parent/upload",
    reports: "/parent/reports",
    settings: "/parent/settings/data",
  },
} as const
