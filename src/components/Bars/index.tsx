import { Progress } from "@material-tailwind/react";

export function ProgressColors() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Progress placeholder="" value={50} color="blue" />
      <Progress placeholder="" value={50} color="red" />
      <Progress placeholder="" value={50} color="green" />
      <Progress placeholder="" value={50} color="amber" />
      <Progress placeholder="" value={50} color="teal" />
      <Progress placeholder="" value={50} color="indigo" />
      <Progress placeholder="" value={50} color="purple" />
      <Progress placeholder="" value={50} color="pink" />
    </div>
  );
}
