import { useState } from "react";
import { LoadingIcon } from "../../shared/components/LoadingIcon";
import { IssueList } from "../components/IssueList";
import { LabelPicker } from "../components/LabelPicker";
import { useIssuesInfinite } from "../hooks";
import { State } from "../interfaces";
// import { useIssues } from "../hooks";

export const ListViewInfinite = () => {
  const [selectedLabels, setSelectedLabel] = useState<string[]>([]);
  const [state, setState] = useState<State>();

  const { issueQuery } = useIssuesInfinite({
    state,
    labels: selectedLabels,
  });

  const onLabelChange = (labelName: string) => {
    selectedLabels.includes(labelName)
      ? setSelectedLabel(selectedLabels.filter((label) => label !== labelName))
      : setSelectedLabel([...selectedLabels, labelName]);
  };

  return (
    <div className="row mt-5">
      <div className="col-8">
        {issueQuery.isLoading ? (
          <LoadingIcon />
        ) : (
          <IssueList
            // Aca aplanamos el arreglo del arreglo
            issues={issueQuery.data?.pages.flat() || []}
            state={state}
            onStateChange={(newState) => setState(newState)}
          />
        )}

        <button
          className="btn btn-outline-primary mt-2"
          disabled={!issueQuery.hasNextPage}
          onClick={() => issueQuery.fetchNextPage()}
        >
          Load More...
        </button>
      </div>

      <div className="col-4">
        <LabelPicker
          selectedLabels={selectedLabels}
          onChange={(labelName) => onLabelChange(labelName)}
        />
      </div>
    </div>
  );
};
