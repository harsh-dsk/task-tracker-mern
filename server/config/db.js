/**
 * db.js — MongoDB Atlas connection via Mongoose.
 *
 * WHY the dns.setServers() call exists here:
 * ──────────────────────────────────────────
 * On this Windows machine, Node.js's internal DNS resolver (c-ares/libuv)
 * is pointing to 127.0.0.1 — a localhost DNS proxy that is not currently
 * running (typically left behind by a VPN client such as Cisco AnyConnect,
 * Cloudflare WARP, or Docker Desktop's DNS stub).
 *
 * When Mongoose opens a mongodb+srv:// URI, it must perform a DNS SRV lookup
 * to discover the actual Atlas shard hostnames. That SRV query goes to
 * 127.0.0.1:53, gets ECONNREFUSED, and Mongoose throws:
 *   "querySrv ECONNREFUSED _mongodb._tcp.cluster0.0zrfqo7.mongodb.net"
 *
 * PowerShell's Resolve-DnsName works fine because it uses the Windows
 * resolver stack independently of Node's c-ares library.
 *
 * FIX: Override Node's DNS servers to Google Public DNS (8.8.8.8) and
 * Cloudflare DNS (1.1.1.1) before any DNS activity takes place.
 * Also set family:4 in Mongoose options to prefer IPv4, because Atlas
 * resolves to an IPv6 NAT64 address first on this network which can
 * cause connection timeouts.
 *
 * PERMANENT FIX (optional): Point your network adapter's DNS to 8.8.8.8
 * or restart the VPN/Docker service that provides the 127.0.0.1 stub.
 * Once done you can remove the dns.setServers() call from this file.
 */

const dns = require("dns");
const mongoose = require("mongoose");
const path = require("path");

// ── Fix 1: Override broken localhost DNS with public resolvers ────────────────
// Remove this block once your system DNS is restored to a working state.
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // ── Guard 1: variable must exist ──────────────────────────────────────────
  if (!uri) {
    console.error("❌  MONGO_URI is not defined in your .env file.");
    console.error(
      `    Expected location: ${path.resolve(__dirname, "../.env")}`
    );
    console.error(
      "    Copy .env.example → .env and fill in your Atlas credentials."
    );
    process.exit(1);
  }

  // ── Guard 2: placeholder tokens must be replaced ──────────────────────────
  if (
    uri.includes("<username>") ||
    uri.includes("<password>") ||
    uri.includes("<dbname>") ||
    uri.includes("YOUR_ATLAS_USERNAME") ||
    uri.includes("YOUR_ATLAS_PASSWORD") ||
    uri.includes("YOUR_DB_NAME")
  ) {
    console.error("❌  MONGO_URI still contains placeholder values.");
    console.error(
      "    Open your .env file and replace all placeholder tokens with your actual Atlas credentials."
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 s — gives DNS time to resolve
      // Fix 2: prefer IPv4 so Mongoose doesn't pick the IPv6 NAT64 address
      // (64:ff9b::...) that this network returns first for Atlas hostnames.
      family: 4,
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
