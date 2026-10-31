import { fileURLToPath } from "node:url"
import { resolve } from "node:path"

export function verifyMedusaDevDatabaseUrl(raw, ref = "gvvoulnmomdiqldplagj") {
  if (!raw) throw new Error("MEDUSADEV_DATABASE_URL is missing")
  if (!/^[a-z0-9]{20}$/.test(ref)) throw new Error("Invalid expected Supabase project ref")

  let url
  try {
    url = new URL(raw)
  } catch {
    throw new Error("Database URL is invalid")
  }
  if (!["postgresql:", "postgres:"].includes(url.protocol)) {
    throw new Error("Only PostgreSQL URLs are allowed")
  }
  if (!url.password) throw new Error("Database credentials are missing")
  if (url.pathname !== "/postgres") throw new Error("Expected the dedicated Supabase postgres database")

  const direct = url.hostname === `db.${ref}.supabase.co` &&
    url.username === "postgres" && (!url.port || url.port === "5432")
  const sessionPooler = url.hostname.endsWith(".pooler.supabase.com") &&
    url.username === `postgres.${ref}` && url.port === "5432"

  if (!direct && !sessionPooler) {
    throw new Error("Database target is not the MedusaDev Supabase project or is using an unsupported pooler mode")
  }

  const ssl = url.searchParams.get("sslmode")
  if (ssl && !["require", "verify-ca", "verify-full"].includes(ssl)) {
    throw new Error("Database TLS must be required")
  }

  return { projectRef: ref, connectionMode: direct ? "direct" : "session-pooler" }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const target = verifyMedusaDevDatabaseUrl(
      process.env.DATABASE_URL,
      process.env.MEDUSADEV_PROJECT_REF || "gvvoulnmomdiqldplagj",
    )
    console.log(`MedusaDev connection target verified (${target.connectionMode}); credentials not displayed`)
  } catch (err) {
    console.error("Database target rejected:", err.message)
    process.exitCode = 1
  }
}
