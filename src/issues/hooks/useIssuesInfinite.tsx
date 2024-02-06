import { useInfiniteQuery } from "@tanstack/react-query";
import { githubApi } from "../../api/githubApi";
import { sleep } from "../../helpers";
import { Issue, State } from "../interfaces";

interface Props {
  state?: State;
  labels: string[];
  page?: number;
}

interface QueryProps {
  pageParams?: number;
  queryKey: (string | Props)[];
}

const getIssues = async ({
  pageParams = 1,
  queryKey,
}: QueryProps): Promise<Issue[]> => {
  const [, , args] = queryKey;
  const { state, labels } = args as Props;

  await sleep(2);

  const params = new URLSearchParams();

  if (state) params.append("state", state);

  if (labels.length > 0) {
    const labelString = labels.join(","); // label1, label2, label3
    params.append("labels", labelString);
  }

  params.append("page", pageParams.toString());
  params.append("per_page", "5");

  // Los params van a ser parte de la url y automaticamente los va a concatenar por uno y hace los url
  // que queremos
  const { data } = await githubApi.get<Issue[]>("/issues", { params });
  // console.log(data);

  return data;
};

export const useIssuesInfinite = ({ state, labels }: Props) => {
  const issueQuery = useInfiniteQuery(
    ["issues", "infinite", { state, labels }],
    (data) => getIssues(data),

    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return;

        return pages.length + 1;
      },
    }
  );

  return {
    issueQuery,
  };
};
