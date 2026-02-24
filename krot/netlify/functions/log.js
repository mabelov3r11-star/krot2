// Netlify Function: /.netlify/functions/log
// Sends simple site interaction logs to Telegram.
// Configure env vars in Netlify:
// - TG_BOT_TOKEN
// - TG_CHAT_ID

const sanitize = (v, maxLen) => {
  if (v === undefined || v === null) return "";
  return String(v).replace(/[\r\n\t]/g, " ").slice(0, maxLen);
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: "Method Not Allowed",
      };
    }

    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;
    if (!token || !chatId) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: "Missing TG_BOT_TOKEN / TG_CHAT_ID",
      };
    }

    let payload = {};
    try {
      payload = JSON.parse(event.body || "{}");
    } catch (_) {
      payload = {};
    }

    const action = sanitize(payload.action, 120);
    const device = sanitize(payload.device, 120);
    const country = sanitize(payload.country, 10);
    const city = sanitize(payload.city, 60);

    // Best-effort IP (Netlify / proxies)
    const ip =
      event.headers["x-nf-client-connection-ip"] ||
      (event.headers["x-forwarded-for"] ? event.headers["x-forwarded-for"].split(",")[0].trim() : "") ||
      "";

    const lines = [
      "Rave log",
      action ? `action: ${action}` : null,
      device ? `device: ${device}` : null,
      (country || city) ? `geo: ${country}${country && city ? ", " : ""}${city}` : null,
      ip ? `ip: ${ip}` : null,
      `time: ${new Date().toISOString()}`
    ].filter(Boolean);

    const text = lines.join("\n");

    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return {
        statusCode: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: "Telegram error: " + err,
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: "Bad Request",
    };
  }
};
