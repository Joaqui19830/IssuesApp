import { useQuery } from "@tanstack/react-query";
import { githubApi } from "../../api/githubApi";
import { sleep } from "../../helpers/sleep";
import { Issue } from "../interfaces";

export const getIssueInfo = async (issueNumber: number): Promise<Issue> => {
  await sleep(2);
  const { data } = await githubApi.get<Issue>(`/issues/${issueNumber}`);
  //   console.log(data);
  return data;
};

export const getIssueComments = async (
  issueNumber: number
): Promise<Issue[]> => {
  await sleep(2);
  const { data } = await githubApi.get<Issue[]>(
    `/issues/${issueNumber}/comments`
  );
  //   console.log(data);
  return data;
};

export const useIssue = (issueNumber: number) => {
  const isIssueQuery = useQuery({
    queryKey: ["issue", issueNumber],
    queryFn: () => getIssueInfo(issueNumber),
  });
  const commentsQuery = useQuery({
    queryKey: ["issue", issueNumber, "comments"],
    queryFn: () => getIssueComments(isIssueQuery.data!.number),
    // queryFn: () => getIssueComments(issueNumber),
    // enabled: false // Este es para mostrar solo 1 comentario y no muestra todos los demas
    enabled: isIssueQuery.data !== undefined, //Es como para tener el efecto de que carga los demas comentarios
  });

  return {
    isIssueQuery,
    commentsQuery,
  };
};
