import { Caca } from "@/lib/definitions";
import { Progress } from "@material-tailwind/react";
import { color } from "@material-tailwind/react/types/components/alert";
let colors = [
  "blue-gray",
  "gray",
  "brown",
  "deep-orange",
  "orange",
  "amber",
  "yellow",
  "lime",
  "light-green",
  "green",
  "teal",
  "cyan",
  "light-blue",
  "blue",
  "indigo",
  "deep-purple",
  "purple",
  "pink",
  "red",
];
export default ({
  name,
  cacas,
  position,
  totalcacas,
  champ,
}: {
  position: number;
  name: string;
  cacas: Caca[];
  totalcacas: number;
  champ: number;
}) => {
  return (
    <div>
      <h2 className="text-left ">
        <span className={"text-" + colors[position] + "-400"}>{position}</span>{" "}
        {name}{" "}
        {cacas &&
          cacas.length > 0 &&
          (cacas.length > 1 ? `${cacas.length} cacas` : `${cacas.length} caca`)}
      </h2>
      <Progress
        placeholder=""
        value={(cacas.length * 100) / champ}
        color={colors[position] as color}
      />
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 pr-2">
        {Number.parseFloat((cacas.length * 100) / totalcacas + "").toFixed(1)}%
      </span>
    </div>
  );
};
