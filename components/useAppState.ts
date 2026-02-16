"use client";

import { useEffect, useMemo, useState } from "react";
import { getAppConfig } from "@/lib/config";
import { rankItems } from "@/lib/ranking";
import { seedItems, seedSources } from "@/lib/seed-data";
import type { FeedItem, SourceConfig, UserPrefs } from "@/lib/types";

const PREFS_KEY = "inflow-prefs";
const SOURCES_KEY = "inflow-sources";
const ITEMS_KEY = "inflow-items";

const defaultPrefs: UserPrefs = {
  compactMode: false,
  interests: ["AI", "Product", "Markets", "Design", "Climate"],
  hiddenSources: [],
  savedItemIds: [],
  theme: "dark"
};

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useAppState() {
  const [prefs, setPrefs] = useState<UserPrefs>(defaultPrefs);
  const [sources, setSources] = useState<SourceConfig[]>([]);
  const [items, setItems] = useState<FeedItem[]>([]);
  const config = getAppConfig();

  useEffect(() => {
    const initPrefs = readJSON(PREFS_KEY, defaultPrefs);
    const initSources = readJSON(SOURCES_KEY, seedSources);
    const initItems = readJSON(ITEMS_KEY, seedItems);
    setPrefs(initPrefs);
    setSources(initSources);
    setItems(initItems);
  }, []);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);
  useEffect(() => {
    localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
  }, [sources]);
  useEffect(() => {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  }, [items]);

  const rankedFeed = useMemo(() => {
    const enabledSourceNames = new Set(sources.filter((s) => s.enabled).map((s) => s.name));
    const interestEmbeddings = prefs.interests.map((_, i) => [1, i / 10, 0.4, 0.2]);
    return rankItems(
      items.filter((item) => enabledSourceNames.has(item.source) && !prefs.hiddenSources.includes(item.source)),
      interestEmbeddings
    );
  }, [items, prefs.hiddenSources, prefs.interests, sources]);

  return {
    config,
    prefs,
    sources,
    items,
    rankedFeed,
    setPrefs,
    setSources,
    setItems
  };
}
