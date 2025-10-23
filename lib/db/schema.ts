import { pgTable, text, timestamp, integer, decimal, boolean, uuid, varchar, jsonb, json, doublePrecision, numeric, unique } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

// Hackathons Admin table (renamed from users)
export const hackathonsAdmin = pgTable('hackathons_admin', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('judge'), // 'admin' | 'judge'
  avatar: text('avatar'),
  expertise: text('expertise'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Users Table (from test.ts)
export const users = pgTable("users", {
  id: varchar("id", { length: 256 }).primaryKey(),
  fullName: text("full_name"),
  image_url: varchar("image_url", { length: 256 }),
  metaMask: varchar("MetaMask Wallet Address", { length: 256 }),
  email: varchar("email", { length: 256 }),
  Location: varchar("Location", { length: 256 }),
  Bio: text("Bio"),
  contributorContract: varchar("contributorContract", { length: 256 }),
  maintainerWallet: varchar("maintainerrWallet", { length: 256 }),
  Telegram: varchar("Telegram", { length: 256 }),
  Twitter: varchar("Twitter", { length: 256 }),
  Linkedin: varchar("Linkedin", { length: 256 }),
  rating: integer("rating").default(5),
  skills: json("skills"),
  formFilled: boolean("formFilled").default(false),
  termsAccepted: boolean("termsAccepted").default(false),
})

export const wallet = pgTable("wallet", {
  id: varchar("id", { length: 256 }).primaryKey(),
  walletBalance: decimal("walletBalance", {
    precision: 36,
    scale: 18,
  }).notNull(),
})

export const maintainerWallet = pgTable("maintainerWallet", {
  id: varchar("id", { length: 256 }).primaryKey(),
  walletBalance: decimal("maintainerWalletBalance", {
    precision: 36,
    scale: 18,
  }).notNull(),
})

export const MaintainerWalletTransactions = pgTable(
  "maintainerWallet_transactions",
  {
    id: varchar("id", { length: 256 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    username: varchar("username", { length: 256 }),
    amount: decimal("amount", { precision: 36, scale: 18 }).notNull(),
    transactionType: varchar("transactionType", { length: 256 }).notNull(),
    timestamp: timestamp("timestamp").default(sql`now()`),
  }
)

export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 256 }),
  amount: decimal("amount", { precision: 36, scale: 18 }).notNull(),
  transactionType: varchar("transactionType", { length: 256 }).notNull(),
  timestamp: timestamp("timestamp").default(sql`now()`),
})

// Messages Table
export const messages = pgTable("messages", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  timestamp: timestamp("timestamp"),
  reciever_id: varchar("reciever_id", { length: 256 }),
  sender_id: varchar("sender_id", { length: 256 }),
})

// Issues Table
export const issues = pgTable("issues", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  issue_name: varchar("issue_name", { length: 256 }),
  issue_url: varchar("issue_url", { length: 256 }).unique(),
  publisher: varchar("publisher", { length: 256 }),
  issue_description: text("issue_description"),
  issue_date: varchar("issue_date", { length: 256 }),
  Difficulty: varchar("Difficulty", { length: 256 }),
  priority: varchar("Priority", { length: 256 }),
  project_repository: varchar("Repository", { length: 256 }),
  project_issues: varchar("issues", { length: 256 }),
  rewardAmount: varchar("rewardAmount", { length: 256 }),
  active: boolean("active").default(true),
})

// Project Table
export const project = pgTable("project", {
  projectName: varchar("id", { length: 256 }).primaryKey(),
  aiDescription: text("AI Description"),
  projectOwner: varchar("ProjectOwner", { length: 256 }),
  shortdes: text("Short Description"),
  longdis: text("Long Description"),
  image_url: varchar("image_url", { length: 256 }),
  project_repository: varchar("Repository", { length: 256 }),
  contributors: json("maintainers"),
  maintainerUserIds: json("maintainerUserIds"),
  type: varchar("type", { length: 256 }),
  languages: json("languages"),
  stars: varchar("stars"),
  forks: varchar("forks"),
  owner: json("owner"),
  comits: json("comits"),
  Tag: varchar("Tag", { length: 256 }),
})

export const likes = pgTable("likes", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectName: varchar("projectName", { length: 256 }),
  userId: varchar("userId", { length: 256 }),
  likedAt: timestamp("likedAt").default(sql`now()`),
})

// Contributor Requests Table
export const contributorRequests = pgTable("contributorRequests", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  fullName: varchar("Full Name (User)", { length: 256 }),
  projectName: varchar("projectName", { length: 256 }),
  Contributor_id: varchar("Contributor", { length: 256 }),
  contributor_email: varchar("contributor_email", { length: 256 }),
  requestDate: varchar("requestDate", { length: 256 }),
  projectOwner: varchar("projectOwner", { length: 256 }),
  skills: json("skills"),
  issue: varchar("issue", { length: 256 }),
  image_url: varchar("image_url", { length: 256 }),
  name: varchar("name", { length: 256 }),
  description: text("description"),
  status: varchar("status", { length: 256 }),
})

// Contributor Applications Table
export const contributorApplications = pgTable(
  "contributorApplications",
  {
    id: varchar("id", { length: 256 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    username: varchar("username", { length: 256 }).notNull(), // Auto-filled from session
    projectName: varchar("projectName", { length: 256 }),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    bio: text("bio"),
    whyContribute: text("whyContribute"),
    exampleProjects: text("exampleProjects"),
    languages: json("languages"), // Array of strings
    frameworks: json("frameworks"), // Array of strings
    tools: json("tools"), // Array of strings
    otherSkills: text("otherSkills"),
    experienceMatrix: json("experienceMatrix"), // Object with language experience data
    resumeUrl: varchar("resumeUrl", { length: 512 }), // File upload URL
    samplePatchesUrl: varchar("samplePatchesUrl", { length: 512 }), // File upload URL
    sshPublicKey: text("sshPublicKey"),
    prLinks: text("prLinks"),
    accessLevel: varchar("accessLevel", { length: 100 }),
    ndaAgreement: boolean("ndaAgreement").default(false),
    twoFactorEnabled: boolean("twoFactorEnabled").default(false),
    earliestStartDate: varchar("earliestStartDate", { length: 50 }),
    codeOfConductAgreed: boolean("codeOfConductAgreed").default(false),
    contributionGuidelinesAgreed: boolean(
      "contributionGuidelinesAgreed"
    ).default(false),
    fullName: varchar("fullName", { length: 256 }),
    signatureDate: varchar("signatureDate", { length: 50 }),
    status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected
    submittedAt: timestamp("submittedAt").default(sql`now()`),
  },
  (table) => {
    return {
      // Add unique constraint on username + projectName combination
      usernameProjectUnique: unique().on(table.username, table.projectName),
    };
  }
)

export const payments = pgTable("Payments", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 256 }),
  amount: doublePrecision("amount").notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`),
})

export const assignedIssues = pgTable("assignedIssues", {
  projectName: varchar("projectName", { length: 256 }),
  projectOwner: varchar("projectOwner", { length: 256 }),
  Contributor_id: varchar("Contributor", { length: 256 }),
  issue: varchar("issue", { length: 256 }),
  image_url: varchar("image_url", { length: 256 }),
  name: varchar("name", { length: 256 }),
  description: text("description"),
})

export const Rewards = pgTable("rewards", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  issue_id: varchar("issue_id", { length: 256 }),
  projectName: varchar("projectName", { length: 256 }),
  projectDescription: text("projectDescription"),
  projectOwner: varchar("projectOwner", { length: 256 }),
  project_repository: varchar("project_repository", { length: 256 }),
  Contributor_id: varchar("Contributor Name", { length: 256 }),
  Contributor: varchar("Contributor_id", { length: 256 }),
  transactionHash: varchar("transactionHash", { length: 256 }),
  withdrawn: boolean("withdrawn").default(false),
  rewardAmount: doublePrecision("rewardAmount"),
  issue: varchar("issue", { length: 256 }),
  date: timestamp("date").default(sql`now()`),
})

// Project Embeddings Table for RAG
export const projectEmbeddings = pgTable("project_embeddings", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectName: varchar("project_name", { length: 256 }).notNull(),
  description: text("description").notNull(),
  languages: text("languages"), // JSON string of languages
  owner: varchar("owner", { length: 256 }),
  // embedding: vector("embedding", { dimensions: 384 }).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
})

export const projects = pgTable("projects", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description").notNull(),
  owner: varchar("owner", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
})

export const hack_projects = pgTable("hack_projects", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  hackathon_id: varchar("hackathon_id", { length: 256 }).references(() => hackathons.id),
  project_name: varchar("project_name", { length: 256 }).notNull(),
  description: text("description"),
  repository: varchar("repository", { length: 256 }),
  image_url: varchar("image_url", { length: 256 }),
  owner_id: varchar("owner_id", { length: 256 }).references(() => users.id),
  team_members: jsonb("team_members"),
  tech_stack: jsonb("tech_stack"),
  contract_address: varchar("contract_address", { length: 256 }),
  created_at: timestamp("created_at").default(sql`now()`)
})

export const project_votes = pgTable("project_votes", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  project_id: varchar("project_id", { length: 256 }).references(() => hack_projects.id),
  voter_id: varchar("voter_id", { length: 256 }).references(() => users.id),
  vote_type: varchar("vote_type", { length: 50 }).notNull(),
  vote_weight: integer("vote_weight").default(1),
  created_at: timestamp("created_at").default(sql`now()`),
}, (t) => [
     unique('project_votes_project_voter_unique_idx').on(t.project_id, t.voter_id)
])

export const project_split_payments = pgTable("project_split_payments", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  project_id: varchar("project_id", { length: 256 }).references(() => hack_projects.id),
  total_amount: varchar("total_amount", { length: 256 }).notNull(),
  contributor_share: varchar("contributor_share", { length: 256 }).notNull(),
  maintainer_share: varchar("maintainer_share", { length: 256 }).notNull(),
  transaction_hash: varchar("transaction_hash", { length: 256 }),
  status: varchar("status", { length: 50 }).default("pending"),
  created_at: timestamp("created_at").defaultNow()
})

export const hackathon_results = pgTable("hackathon_results", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  hackathon_id: varchar("hackathon_id", { length: 256 }).references(() => hackathons.id),
  project_id: varchar("project_id", { length: 256 }).references(() => hack_projects.id),
  final_rank: integer("final_rank"),
  total_votes: integer("total_votes").default(0),
  yes_votes: integer("yes_votes").default(0),
  no_votes: integer("no_votes").default(0),
  approval_percentage: decimal("approval_percentage", { precision: 5, scale: 2 }),
  voting_status: varchar("voting_status", { length: 50 }).default("pending"), // pending, approved, rejected
  total_funding: decimal("total_funding", { precision: 36, scale: 18 }).default("0"),
  contributors_funding: decimal("contributors_funding", { precision: 36, scale: 18 }).default("0"),
  maintainers_funding: decimal("maintainers_funding", { precision: 36, scale: 18 }).default("0"),
  award_category: varchar("award_category", { length: 100 }), // "winner", "runner-up", "innovation", etc.
  judge_feedback: text("judge_feedback"),
  demo_url: varchar("demo_url", { length: 512 }),
  presentation_url: varchar("presentation_url", { length: 512 }),
  final_score: decimal("final_score", { precision: 5, scale: 2 }),
  metrics: jsonb("metrics"), // Custom metrics like code quality, innovation, etc.
  created_at: timestamp("created_at").default(sql`now()`),
  updated_at: timestamp("updated_at").default(sql`now()`)
}, (t) => [
  unique('hackathon_results_hackathon_project_unique').on(t.hackathon_id, t.project_id)
])

export const project_certificates = pgTable("project_certificates", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  project_id: varchar("project_id", { length: 256 }).references(() => hack_projects.id),
  ipfs_hash: text("ipfs_hash").notNull(),
  url: text("url"),
  issued_at: timestamp("issued_at").default(sql`now()`),
  issued_by: text("issued_by").notNull(),
  issued_to: varchar("issued_to", { length: 256 }).references(() => users.id),
})

// Hackathons table
export const hackathons = pgTable('hackathons', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  rules: text('rules').notNull(),
  banner: text('banner'),
  teamSizeLimit: integer('team_size_limit').default(5),
  status: varchar('status', { length: 50 }).notNull().default('upcoming'), // 'upcoming' | 'ongoing' | 'completed'
  totalParticipants: integer('total_participants').default(0),
  totalProjects: integer('total_projects').default(0),
  createdBy: uuid('created_by').references(() => hackathonsAdmin.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Prizes table
export const prizes = pgTable('prizes', {
  id: uuid('id').primaryKey().defaultRandom(),
  hackathonId: uuid('hackathon_id').references(() => hackathons.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  winners: integer('winners').default(1),
  position: integer('position').default(1), // 1st, 2nd, 3rd place etc.
  createdAt: timestamp('created_at').defaultNow(),
})

// Judge assignments table (many-to-many relationship)
export const judgeAssignments = pgTable('judge_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  judgeId: uuid('judge_id').references(() => hackathonsAdmin.id, { onDelete: 'cascade' }),
  hackathonId: uuid('hackathon_id').references(() => hackathons.id, { onDelete: 'cascade' }),
  assignedAt: timestamp('assigned_at').defaultNow(),
  assignedBy: uuid('assigned_by').references(() => hackathonsAdmin.id),
})

// Projects table (original hackathon projects)
export const hackathonProjects = pgTable('hackathon_projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  hackathonId: uuid('hackathon_id').references(() => hackathons.id, { onDelete: 'cascade' }),
  teamName: varchar('team_name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  githubLink: text('github_link').notNull(),
  demoLink: text('demo_link'),
  teamSize: integer('team_size').default(1),
  technologies: jsonb('technologies').$type<string[]>().default([]),
  submittedAt: timestamp('submitted_at').defaultNow(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Project scores table
export const projectScores = pgTable('project_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => hackathonProjects.id, { onDelete: 'cascade' }),
  judgeId: uuid('judge_id').references(() => hackathonsAdmin.id, { onDelete: 'cascade' }),
  innovation: integer('innovation').notNull(), // 1-10 scale
  design: integer('design').notNull(), // 1-10 scale
  functionality: integer('functionality').notNull(), // 1-10 scale
  presentation: integer('presentation').notNull(), // 1-10 scale
  totalScore: integer('total_score').notNull(), // Sum of all scores
  comments: text('comments'),
  scoredAt: timestamp('scored_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => hackathonsAdmin.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).default('info'), // 'info' | 'success' | 'warning' | 'error'
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Define relationships
export const hackathonsAdminRelations = relations(hackathonsAdmin, ({ many }) => ({
  createdHackathons: many(hackathons),
  judgeAssignments: many(judgeAssignments),
  projectScores: many(projectScores),
  notifications: many(notifications),
  maintainerWallets: many(maintainerWallet),
}))

export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallet),
  messages: many(messages),
  issues: many(issues),
  projects: many(project),
  likes: many(likes),
  contributorRequests: many(contributorRequests),
  contributorApplications: many(contributorApplications),
  payments: many(payments),
  assignedIssues: many(assignedIssues),
  rewards: many(Rewards),
}))

export const hackathonsRelations = relations(hackathons, ({ one, many }) => ({
  creator: one(hackathonsAdmin, {
    fields: [hackathons.createdBy],
    references: [hackathonsAdmin.id],
  }),
  prizes: many(prizes),
  judgeAssignments: many(judgeAssignments),
  hackathonProjects: many(hackathonProjects),
  hackProjects: many(hack_projects),
  hackathonResults: many(hackathon_results),
}))

export const prizesRelations = relations(prizes, ({ one }) => ({
  hackathon: one(hackathons, {
    fields: [prizes.hackathonId],
    references: [hackathons.id],
  }),
}))

export const judgeAssignmentsRelations = relations(judgeAssignments, ({ one }) => ({
  judge: one(hackathonsAdmin, {
    fields: [judgeAssignments.judgeId],
    references: [hackathonsAdmin.id],
  }),
  hackathon: one(hackathons, {
    fields: [judgeAssignments.hackathonId],
    references: [hackathons.id],
  }),
  assignedBy: one(hackathonsAdmin, {
    fields: [judgeAssignments.assignedBy],
    references: [hackathonsAdmin.id],
  }),
}))

export const hackathonProjectsRelations = relations(hackathonProjects, ({ one, many }) => ({
  hackathon: one(hackathons, {
    fields: [hackathonProjects.hackathonId],
    references: [hackathons.id],
  }),
  scores: many(projectScores),
}))

export const projectScoresRelations = relations(projectScores, ({ one }) => ({
  project: one(hackathonProjects, {
    fields: [projectScores.projectId],
    references: [hackathonProjects.id],
  }),
  judge: one(hackathonsAdmin, {
    fields: [projectScores.judgeId],
    references: [hackathonsAdmin.id],
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(hackathonsAdmin, {
    fields: [notifications.userId],
    references: [hackathonsAdmin.id],
  }),
}))

// Relations for new tables from test.ts
export const walletRelations = relations(wallet, ({ one, many }) => ({
  user: one(users, {
    fields: [wallet.userId],
    references: [users.id],
  }),
  transactions: many(walletTransactions),
}))

export const maintainerWalletRelations = relations(maintainerWallet, ({ one, many }) => ({
  user: one(hackathonsAdmin, {
    fields: [maintainerWallet.userId],
    references: [hackathonsAdmin.id],
  }),
  transactions: many(MaintainerWalletTransactions),
}))

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  wallet: one(wallet, {
    fields: [walletTransactions.walletId],
    references: [wallet.id],
  }),
}))

export const maintainerWalletTransactionsRelations = relations(MaintainerWalletTransactions, ({ one }) => ({
  wallet: one(maintainerWallet, {
    fields: [MaintainerWalletTransactions.walletId],
    references: [maintainerWallet.id],
  }),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}))

export const issuesRelations = relations(issues, ({ one, many }) => ({
  user: one(users, {
    fields: [issues.userId],
    references: [users.id],
  }),
  project: one(project, {
    fields: [issues.projectId],
    references: [project.id],
  }),
  assignedIssues: many(assignedIssues),
}))

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(users, {
    fields: [project.userId],
    references: [users.id],
  }),
  issues: many(issues),
  likes: many(likes),
  contributorRequests: many(contributorRequests),
  contributorApplications: many(contributorApplications),
  payments: many(payments),
  rewards: many(Rewards),
  embeddings: many(projectEmbeddings),
  hackProjects: many(hack_projects),
}))

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  project: one(project, {
    fields: [likes.projectId],
    references: [project.id],
  }),
}))

export const contributorRequestsRelations = relations(contributorRequests, ({ one }) => ({
  user: one(users, {
    fields: [contributorRequests.userId],
    references: [users.id],
  }),
  project: one(project, {
    fields: [contributorRequests.projectId],
    references: [project.id],
  }),
}))

export const contributorApplicationsRelations = relations(contributorApplications, ({ one }) => ({
  user: one(users, {
    fields: [contributorApplications.userId],
    references: [users.id],
  }),
  project: one(project, {
    fields: [contributorApplications.projectId],
    references: [project.id],
  }),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  project: one(project, {
    fields: [payments.projectId],
    references: [project.id],
  }),
}))

export const assignedIssuesRelations = relations(assignedIssues, ({ one }) => ({
  user: one(users, {
    fields: [assignedIssues.userId],
    references: [users.id],
  }),
  issue: one(issues, {
    fields: [assignedIssues.issueId],
    references: [issues.id],
  }),
}))

export const rewardsRelations = relations(Rewards, ({ one }) => ({
  user: one(users, {
    fields: [Rewards.userId],
    references: [users.id],
  }),
  project: one(project, {
    fields: [Rewards.projectId],
    references: [project.id],
  }),
}))

export const projectEmbeddingsRelations = relations(projectEmbeddings, ({ one }) => ({
  project: one(project, {
    fields: [projectEmbeddings.projectId],
    references: [project.id],
  }),
}))

export const projectsRelations = relations(projects, ({ many }) => ({
  hackProjects: many(hack_projects),
}))

export const hackProjectsRelations = relations(hack_projects, ({ one, many }) => ({
  hackathon: one(hackathons, {
    fields: [hack_projects.hackathonId],
    references: [hackathons.id],
  }),
  project: one(project, {
    fields: [hack_projects.projectId],
    references: [project.id],
  }),
  votes: many(project_votes),
  splitPayments: many(project_split_payments),
  certificates: many(project_certificates),
}))

export const projectVotesRelations = relations(project_votes, ({ one }) => ({
  hackProject: one(hack_projects, {
    fields: [project_votes.hackProjectId],
    references: [hack_projects.id],
  }),
}))

export const projectSplitPaymentsRelations = relations(project_split_payments, ({ one }) => ({
  hackProject: one(hack_projects, {
    fields: [project_split_payments.hackProjectId],
    references: [hack_projects.id],
  }),
}))

export const hackathonResultsRelations = relations(hackathon_results, ({ one }) => ({
  hackathon: one(hackathons, {
    fields: [hackathon_results.hackathonId],
    references: [hackathons.id],
  }),
}))

export const projectCertificatesRelations = relations(project_certificates, ({id({
  hackProject: one(hack_projects, {
    fields: [project_certificates.hackProjectId],
    references: [hack_projects.id],
  }),
}))

// Export types for use in API routes
export type HackathonsAdmin = typeof hackathonsAdmin.$inferSelect
export type NewHackathonsAdmin = typeof hackathonsAdmin.$inferInsert
exporid = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Hackathon = typeof hackathons.$inferSelect
export type NewHackathon = typeof hackathons.$inferInsert
export type Prize = typeof prizes.$inferSelect
export type NewPridf prizes.$inferInsert
export type JudgeAssignment = typeof judgeAssignments.$inferSelect
export type NewJudgeAssignment = typeof judgeAssignments.$inferInsert
export type HackathonProject = typeof hackathonProjects.$inferSelect
export type NewHackathonProject = typeof hackathonProjects.$inferInsert
export type ProjectScore = typeof projectScores.$inferSelect
export type NewProjectScore = typeof projectScores.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof nids.$inferInsert

// Export types for new tables from test.ts
export type Wallet = typeof wallet.$inferSelect
export type NewWallet = typeof wallet.$inferInsert
export type MaintainerWallet = typeoidrWallet.$inferSelect
export type NewMaintainerWallet = typeof maintainerWallet.$inferInsert
export type MaintainerWalletTransaction = typeof MaintainerWalletTransactions.$inferSelect
export type NewMaintainerWalletTransaction = typeof MaintainerWalletTransactions.$inferInsert
export type WalletTransaction = typeof walletTransactions.$inferSelect
export type NewWalletTransaction = typeof walletTransactions.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type Issue = typeof issues.$inferSelect
export type NewIssue = typeof issues.$inferInsert
export type Project = typeof project.$inferSelect
export type NewProject = typeof project.$inferInsert
export type Like = typeof likes.$inferSelect
export type NewLike = typeof likes.$inferInsert
export type ContributorRequest = typeof contributorRequests.$inferSelect
export type NewContributorRequest = typeof contributorRequests.$inferInsert
export type ContributorApplication = typeof contributorApplications.$inferSelect
export type NewContributorApplication = typeof contributorApplications.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type AssignedIssue = typeof assignedIssues.$inferSelect
export type NewAssignedIssue = typeof assignedIssues.$inferInsert
export type Reward = typeof Rewards.$inferSelect
export type NewReward = typeof Rewards.$inferInsert
export type ProjectEmbedding = typeof projectEmbeddings.$inferSelect
export type NewProjectEmbedding = typeof projectEmbeddings.$inferInsert
export type Projects = typeof projects.$inferSelect
export type NewProjects = typeof projects.$inferInsert
export type HackProject = typeof hack_projects.$inferSelect
export type NewHackProject = typeof hack_projects.$inferInsert
export type ProjectVote = typeof project_votes.$inferSelect
export type NewProjectVote = typeof project_votes.$inferInsert
export type ProjectSplitPayment = typeof project_split_payments.$inferSelect
export type NewProjectSplitPayment = typeof project_split_payments.$inferInsert
export type HackathonResult = typeof hackathon_results.$inferSelect
export type NewHackathonResult = typeof hackathon_results.$inferInsert
export type ProjectCertificate = typeof project_certificates.$inferSelect
export type NewProjectCertificate = typeof project_certificates.$inferInsertexport type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
