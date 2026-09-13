export interface SeedSegment {
  speaker: string
  text: string
  start_time_ms: number
  end_time_ms: number
}

export const SHOWCASE_MEETING_TITLE = "Product Strategy & Engineering Sync"

export const SHOWCASE_PARTICIPANTS = [
  "Sarah (Product Lead)",
  "Daniel (Tech Lead)",
  "Emily (UX Lead)",
  "Alex (Backend Lead)",
  "Marcus (Frontend Eng)",
  "Priya (Data Eng)",
  "David (QA Lead)",
  "Jordan (DevOps Lead)",
]

export const SHOWCASE_TRANSCRIPT: SeedSegment[] = [
  {
    speaker: "Sarah",
    text: "Good morning everyone. Welcome to our Product Strategy and Engineering Sync. Today we need to align on our key initiatives for the Q4 roadmap, specifically focusing on the onboarding redesign, API reliability, and our new analytics dashboard ahead of our upcoming launch planning.",
    start_time_ms: 0,
    end_time_ms: 15000,
  },
  {
    speaker: "Daniel",
    text: "Thanks Sarah. From the core infrastructure team, our top priority for Q4 is API reliability. Over the past month, we saw traffic spikes degrade p99 response times to over 800 milliseconds. We must complete our rate limiter refactoring and database connection pooling by next Wednesday to hit our 99.9% uptime SLA.",
    start_time_ms: 15500,
    end_time_ms: 32000,
  },
  {
    speaker: "Alex",
    text: "I agree with Daniel. I will take ownership of the Redis cluster upgrade and query optimization for the API gateway. I'll pair with Marcus on frontend response caching to ensure the client stays responsive during failovers.",
    start_time_ms: 32500,
    end_time_ms: 45000,
  },
  {
    speaker: "Emily",
    text: "Moving to user experience, the onboarding redesign is in its final iteration. We streamlined the account creation flow from 7 steps down to 3, which reduced drop-off by 34% in user testing. I will finalize the design assets and hand off Figma specs to Marcus by Tuesday.",
    start_time_ms: 45500,
    end_time_ms: 62000,
  },
  {
    speaker: "Marcus",
    text: "Awesome work Emily. Once I receive the Figma designs on Tuesday, I will implement the new onboarding steps using our updated UI design tokens. Frontend implementation will be ready for QA review by Friday.",
    start_time_ms: 62500,
    end_time_ms: 74000,
  },
  {
    speaker: "Priya",
    text: "On the data engineering side, the analytics dashboard back-end pipelines are fully operational. We now aggregate meeting metrics, transcript sentiment, and action item completion rates in real time. We are ready to expose the aggregated endpoints to Marcus for visualization.",
    start_time_ms: 74500,
    end_time_ms: 91000,
  },
  {
    speaker: "David",
    text: "QA is preparing full end-to-end regression suites for both the onboarding flow and the analytics dashboard. We will execute automated integration test runs as soon as Marcus merges the frontend components on Friday.",
    start_time_ms: 91500,
    end_time_ms: 104000,
  },
  {
    speaker: "Jordan",
    text: "DevOps has provisioned the staging and production environments with multi-region failover. I will finalize CI/CD deployment pipelines and security scanning rules by next Thursday ahead of the official release.",
    start_time_ms: 104500,
    end_time_ms: 118000,
  },
  {
    speaker: "Sarah",
    text: "Great alignment team! To summarize our decisions and commitments: Daniel and Alex own API reliability, Emily and Marcus own the onboarding redesign, Priya and Marcus own the analytics dashboard, and Jordan will finalize launch deployment rules. Let's execute on schedule for Q4. Meeting adjourned!",
    start_time_ms: 118500,
    end_time_ms: 135000,
  },
]
