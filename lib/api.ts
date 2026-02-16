export function getHealthPayload() {
  return {
    ok: true,
    app: "inFlow",
    version: "mvp-2",
    timestamp: new Date().toISOString()
  };
}
