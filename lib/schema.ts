interface SqlClient {
  execute: (sql: string, args?: unknown[]) => Promise<unknown>;
}

export async function ensureSchema(client: SqlClient): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      planType TEXT,
      createdAt TEXT
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      userId TEXT,
      createdAt TEXT
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      userId TEXT,
      slug TEXT UNIQUE,
      name TEXT,
      headline TEXT,
      summary TEXT,
      university TEXT,
      gradYear TEXT,
      internshipStatus TEXT,
      accentColor TEXT,
      templateId TEXT,
      published INTEGER,
      createdAt TEXT,
      updatedAt TEXT,
      skills TEXT,
      resume TEXT,
      profileImageUrl TEXT,
      profileImageVisible INTEGER,
      bgImageUrl TEXT,
      bgImageOverlay INTEGER,
      contactEmail TEXT,
      emailVisible INTEGER,
      resumeBlockType TEXT,
      socials TEXT
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      profileId TEXT,
      title TEXT,
      summary TEXT,
      highlights TEXT,
      githubUrl TEXT,
      demoUrl TEXT,
      techStack TEXT,
      orderIndex INTEGER,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT)
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS email_otps (
      email TEXT NOT NULL,
      purpose TEXT NOT NULL,
      otp TEXT NOT NULL,
      expiresAt TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      PRIMARY KEY (email, purpose)
    )
  `);
}
