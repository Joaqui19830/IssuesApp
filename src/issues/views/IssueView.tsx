import { Link, Navigate, useParams } from "react-router-dom";
import { LoadingIcon } from "../../shared/components/LoadingIcon";
import { IssueComment } from "../components/IssueComment";
import { useIssue } from "../hooks";

export const IssueView = () => {
  const params = useParams();
  const { id = "0" } = params;

  // Ese +id es para transfromarlo a numero es lo mismo que poner Number(id)
  const { isIssueQuery, commentsQuery } = useIssue(+id);

  if (isIssueQuery.isLoading) return <LoadingIcon />;

  if (!isIssueQuery.data) return <Navigate to="./issues/list" />;

  return (
    <div className="row mb-5">
      <div className="col-12 mb-3">
        <Link to="./issues/list">Go Back</Link>
      </div>

      {/* Primer comentario */}
      <IssueComment issue={isIssueQuery.data} />

      {commentsQuery.isLoading && <LoadingIcon />}

      {commentsQuery.data?.map((issue) => (
        <IssueComment key={issue.id} issue={issue} />
      ))}

      {/* Comentario de otros */}
      {/* <IssueComment body={comment3} /> */}
    </div>
  );
};
