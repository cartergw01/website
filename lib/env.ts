import { getAppConfig } from "@/lib/config";

export function getEnvState() {
  return getAppConfig();
}
