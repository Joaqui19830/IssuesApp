import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { githubApi } from "../../api/githubApi";
import { sleep } from "../../helpers/sleep";
import { Issue, State } from "../interfaces";

interface Props {
  state?: State;
  labels: string[];
  page?: number;
}

const getIssues = async ({
  labels,
  state,
  page = 1,
}: Props): Promise<Issue[]> => {
  await sleep(2);

  // Obj para crear parametros
  const params = new URLSearchParams();

  if (state) params.append("state", state);

  if (labels.length > 0) {
    const labelString = labels.join(","); // label1, label2, label3
    params.append("labels", labelString);
  }

  params.append("page", page.toString());
  params.append("per_page", "5");

  // Los params van a ser parte de la url y automaticamente los va a concatenar por uno y hace los url
  // que queremos
  const { data } = await githubApi.get<Issue[]>("/issues", { params });
  // console.log(data);

  return data;
};

export const useIssues = ({ state, labels }: Props) => {
  const [page, setPage] = useState(1);

  // Cualquiera de estas que cambie lo vuelvo a llevar a la pagina 1 es decir si cambia el state o el labels
  // lo redirijo a la pagina 1
  useEffect(() => {
    setPage(1);
  }, [state, labels]);

  const issuesQuery = useQuery({
    // Aca yo puedo mandar los argumentos desordenados que reactquery va a saber el orden que van
    queryKey: ["issues", { state, labels, page }],
    queryFn: () => getIssues({ labels, state, page }),
  });

  const nextPage = () => {
    // Aca le preguntamos si no hay mas data lo retornamos para decirle que no queremos que vaya a la sig pag
    // ya que no hay mas data
    if (issuesQuery.data?.length === 0) return;

    setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return {
    //Properties
    issuesQuery,

    //Getter
    page: issuesQuery.isFetching ? "Loading" : page,

    //Method
    nextPage,
    prevPage,
  };
};
