import test from "node:test"
import assert from "node:assert/strict"
import { verifyMedusaDevDatabaseUrl } from "./verify-medusadev-db.mjs"

const ref = "gvvoulnmomdiqldplagj"
const password = "fake-only-for-automated-tests"
const direct = `postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres?sslmode=require`
const pool = `postgresql://postgres.${ref}:${password}@aws-0-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=require`

test("accepts exact MedusaDev direct endpoint", () => {
  assert.equal(verifyMedusaDevDatabaseUrl(direct).connectionMode, "direct")
})
test("accepts MedusaDev session pooler only", () => {
  assert.equal(verifyMedusaDevDatabaseUrl(pool).connectionMode, "session-pooler")
})
test("rejects unrelated Supabase projects", () => {
  assert.throws(() => verifyMedusaDevDatabaseUrl(direct.replace(ref, "xodgfmxiaunpamctfeea")))
})
test("rejects transaction pooling on port 6543", () => {
  assert.throws(() => verifyMedusaDevDatabaseUrl(pool.replace(":5432/", ":6543/")))
})
test("rejects disabling TLS", () => {
  assert.throws(() => verifyMedusaDevDatabaseUrl(direct.replace("sslmode=require", "sslmode=disable")))
})
test("rejects missing credentials", () => {
  assert.throws(() => verifyMedusaDevDatabaseUrl(direct.replace(password, "")))
})
test("rejects unknown database name", () => {
  assert.throws(() => verifyMedusaDevDatabaseUrl(direct.replace("/postgres?", "/sga?")))
})
