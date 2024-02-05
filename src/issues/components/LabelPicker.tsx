import { FC } from "react";
import { LoadingIcon } from "../../shared/components/LoadingIcon";
import { useLabel } from "../hooks/useLabel";

interface Props {
  selectedLabels: string[];
  onChange: (labelName: string) => void;
}

export const LabelPicker: FC<Props> = ({ selectedLabels, onChange }) => {
  const labelsQuery = useLabel();

  if (labelsQuery.isLoading)
    //! por que isLoading y no isFetching
    // El isLoading a diferencia del isFetching es cuando estamos cargando la data por primera vez en
    // cache y no tenemos nada de data ahi es donde se va a mostrar el isLoading y el isFetching se va
    // a disparar siempre que estemos haciendo una peticion
    return <LoadingIcon />;

  return (
    <>
      {labelsQuery.data?.map((label) => (
        <span
          key={label.id}
          className={`badge rounded-pill m-1 label-picker ${
            selectedLabels.includes(label.name) ? "label-active" : ""
          }`}
          style={{
            border: `1px solid #${label.color}`,
            color: `#${label.color}`,
          }}
          onClick={() => onChange(label.name)}
        >
          {label.name}
        </span>
      ))}
    </>
  );
};
