import { Caca } from "@/lib/definitions";

export default ({
  name,
  cacas,
  position,
  totalcacas,
}: {
  position: number;
  name: string;
  cacas: Caca[];
  totalcacas: number;
}) => {
  return (
    <div className="flex items-center mt-4 w-full justify-center align-center ">
      <h2 className="text-left">
        <span className="text-[#ffbff4]">{position}</span> {name}{" "}
        {cacas && cacas.length} cacas 💩
      </h2>
      <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
        <div
          className="h-5 bg-yellow-300 rounded"
          style={{ width: (cacas.length * 100) / totalcacas + "%" }}
        ></div>
      </div>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {Math.round((cacas.length * 100) / totalcacas)}% del total de cacas
      </span>
    </div>
  );
};
