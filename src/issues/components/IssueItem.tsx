import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { FiCheckCircle, FiInfo, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { timeSince } from "../../helpers";
import { getIssueComments, getIssueInfo } from "../hooks/useIssue";
import { Issue, State } from "../interfaces";

interface Props {
  issue: Issue;
}

export const IssueItem: FC<Props> = ({ issue }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //Si mandamos un argumento que no sea el del event que tiene el mouseEnter ahi abajo si
  // lo especificariamos con una () => nombre de la fn
  const prefetchData = () => {
    // console.log("MouseEnter");

    // Los dos queryClient son para que cuando pasemos el mouse por arriba del issue se cargue la info
    // en el cache y sea mas rapido asi tambien podemos trabajar con la info ya actualizada
    queryClient.prefetchQuery({
      queryKey: ["issue", issue.number],
      queryFn: () => getIssueInfo(issue.number),
    });

    queryClient.prefetchQuery({
      queryKey: ["issue", issue.number, "comments"], // Este es un identiicador de nuestro caché
      queryFn: () => getIssueComments(issue.number),
    });
  };

  const preSetData = () => {
    queryClient.setQueryData(["issue", issue.number], issue, {
      // Esto es para actualizar el issue y la informacion se mantiene refresh hasta el momento
      // en el que pasa ese tiempo es decir que se mantiene actualizada
      updatedAt: new Date().getTime() + 100000,
    });
  };

  return (
    <div
      className="card mb-2 issue"
      onClick={() => navigate(`/issues/issue/${issue.number}`)}
      // onMouseEnter={prefetchData}
      onMouseEnter={preSetData}
    >
      <div className="card-body d-flex align-items-center">
        {issue.state === State.Open ? (
          <FiInfo size={30} color="red" />
        ) : (
          <FiCheckCircle size={30} color="green" />
        )}

        <div className="d-flex flex-column flex-fill px-2">
          <span>{issue.title}</span>
          <span className="issue-subinfo">
            #{issue.number} opened {timeSince(issue.created_at)} ago by
            <span className="fw-bold">{issue.user.login}</span>
          </span>
          <div>
            {issue.labels.map((label) => (
              <span
                key={label.id}
                className="badge rounded-pill m-1"
                style={{ backgroundColor: `#${label.color}`, color: "black" }}
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-center">
          <img
            src={issue.user.avatar_url}
            alt="User Avatar"
            className="avatar"
          />
          <span className="px-2">{issue.comments}</span>
          <FiMessageSquare />
        </div>
      </div>
    </div>
  );
};
