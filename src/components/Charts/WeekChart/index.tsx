"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Props } from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: true });
const hexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
export function changeHex() {
  let hex = "#";

  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * hexValues.length);
    hex += hexValues[index];
  }
  return hex;
}
const chartConfig: Props = {
  type: "bar",
  height: 540,
  series: [],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {},
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617"],
    plotOptions: {
      bar: {
        columnWidth: "80%",
        borderRadius: 2,
      },
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  },
};
function ApexChart(props: any) {
  const [Chart, setChart] = useState<any>();
  const hasType = typeof props?.type !== "undefined";
  function checker(nombre: string) {
    return chartConfig.series?.filter((s) => {
      if (typeof s !== "number" && s.name) return s.name === nombre;
    }).length;
  }
  useEffect(() => {
    if (props.semana) {
      props.semana.forEach((dia: Map<string, number>) => {
        dia.forEach((value, chabon) => {
          if (!checker(chabon)) {
            const obj:
              | number
              | { name?: string; data?: number[]; color: string } = {
              name: chabon,
              data: [value],
              color: changeHex(),
            };
            chartConfig.series?.push(obj as any);
          } else {
            chartConfig.series?.forEach((el) => {
              if (typeof el !== "number" && el.name === chabon)
                el.data.push(value as any);
            });
            return;
          }
        });
      });
    }
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, [props.semana]);

  return hasType && Chart && chartConfig.series?.length && <Chart {...props} />;
}
export default function Example({ semana }: { semana: any[] }) {
  return (
    <Card placeholder={""} className="rounded-none">
      <CardHeader
        placeholder={""}
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div>
          <Typography placeholder={""} variant="h6" color="blue-gray">
            DÍAS MÁS CAGADOS
          </Typography>
          <Typography
            placeholder={""}
            variant="small"
            color="gray"
            className="max-w-sm font-normal"
          >
            Los días de la semana que fueron más defecados en total.
          </Typography>
        </div>
      </CardHeader>
      <CardBody placeholder={""} className="px-2 pb-0">
        {typeof window !== "undefined" && semana && (
          <ApexChart {...chartConfig} semana={semana} />
        )}
      </CardBody>
    </Card>
  );
}
