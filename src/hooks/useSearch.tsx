import { getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";
import { useState } from "react";
import useSWR from "swr";

type Post = {
  number: number;
  name: string;
  full_name: string;
  wip: boolean;
  body_md: string;
  body_html: string;
  created_at: string;
  message: string;
  url: string;
  updated_at: string;
  tags: string[];
  category: string;
  revision_number: number;
  created_by: {
    myself: boolean;
    name: string;
    screen_name: string;
    icon: string;
  };
  updated_by: {
    myself: boolean;
    name: string;
    screen_name: string;
    icon: string;
  };
};

type Posts = {
  posts: Post[];
};

interface Preferences {
  apiKey: string;
  teamName: string;
}

const buildFetcher = ({ teamName, apiKey, searchText }: { teamName: string; apiKey: string; searchText: string }) => {
  return async (): Promise<Posts> => {
    const res = await fetch(`https://api.esa.io/v1/teams/${teamName}/posts?q=${searchText}&sort=best_match`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      method: "GET",
    });
    if (res.status !== 200) {
      throw new Error(res.statusText);
    }
    // 型はあとで頑張る
    return res.json() as Promise<Posts>;
  };
};

export const useSearch = () => {
  const { apiKey, teamName } = getPreferenceValues<Preferences>();
  const [searchText, setSearchText] = useState("");

  if (!apiKey) throw new Error("Missing API key.");
  if (!teamName) throw new Error("Missing team name.");

  const fetcher = buildFetcher({ teamName, apiKey, searchText });

  const { data, error } = useSWR<Posts>(`https://api.esa.io/v1/teams/:team_name/posts?q=${searchText}`, fetcher);

  return {
    data,
    error,
    setSearchText,
  };
};
