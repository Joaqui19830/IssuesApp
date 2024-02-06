import { useQuery } from "@tanstack/react-query";
import { githubApi } from "../../api/githubApi";
import { sleep } from "../../helpers/sleep";
import { Label } from "../interfaces/label";

const getLabels = async (): Promise<Label[]> => {
  await sleep(2);

  const { data } = await githubApi.get<Label[]>("/labels?per_page=100", {
    headers: {
      Authorization: null,
    },
  });

  return data;
};

export const useLabel = () => {
  const labelsQuery = useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
    // staleTime: 1000 * 60 * 60, // Esto es que dura la data fresca 1hs
    // Este es para que no mande la peticion cada vez que sacamos el foco de la pantalla
    // refetchOnWindowFocus: false,
    // placeholderData: [], Este realiza tiene la data mientras se hace la peticion
    // initialData: [],
    placeholderData: [
      {
        id: 717031390,

        node_id: "MDU6TGFiZWw3MTcwMzEzOTA=",

        url: "https://api.github.com/repos/facebook/react/labels/good%20first%20issue",

        name: "good first issue",

        color: "6ce26a",

        default: true,
      },
      {
        id: 739777675,

        node_id: "MDU6TGFiZWw3Mzk3Nzc2NzU=",

        url: "https://api.github.com/repos/facebook/react/labels/Component:%20Component%20API",

        name: "Component: Component API",

        color: "d4c5f9",

        default: false,
      },
    ],
  });

  return labelsQuery;
};
