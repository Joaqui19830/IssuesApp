import axios from "axios";

export const githubApi = axios.create({
  baseURL: "https://api.github.com/repos/facebook/react",
  headers: {
    Authorization:
      "Barear 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",
  },
});
