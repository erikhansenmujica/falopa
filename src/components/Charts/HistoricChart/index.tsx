import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { changeHex } from "../WeekChart";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: true });
// If you're using Next.js please use the dynamic import for react-apexcharts and remove the import from the top for the react-apexcharts
// import dynamic from "next/dynamic";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartConfig = {
  type: "line",
  height: 540,
  series: [],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617"],
    stroke: {
      lineCap: "round",
      curve: "smooth",
    },
    markers: {
      size: 0,
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
      categories: [],
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

function check(chart: any, name: string) {
  return chart.filter((ch: any) => ch.name === name);
}

const ApexChart = (props: any) => {
  const [Chart2, setChart] = useState<any>();
  const hasType = typeof props?.type !== "undefined";
  useEffect(() => {
    for (const key in props.month) {
      let day = props.month[key];
      let cagos = day[Object.keys(day)[0]];
      chartConfig.options.xaxis.categories.push(Object.keys(day)[0] as never);
      cagos.forEach((cago: any) => {
        console.log(cago);
        let chartcago = check(chartConfig.series, cago.name);
        if (chartcago.length) {
          chartcago[0].data.push(cago.cacas);
        } else {
          chartConfig.series.push({
            name: cago.name,
            data: [cago.cacas],
            color: changeHex(),
          } as never);
        }
      });

      console.log(chartConfig.series);
    }

    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, [props.month]);

  return (
    hasType && Chart2 && chartConfig.series?.length && <Chart {...props} />
  );
};

export default function Example({ month }: { month: any }) {
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
            Histórico Caca
          </Typography>
          <Typography
            placeholder={""}
            variant="small"
            color="gray"
            className="max-w-sm font-normal"
          >
            Gráfico histórico de la evolución de los cagos a lo largo de la
            historia
          </Typography>
        </div>
      </CardHeader>
      <CardBody placeholder={""} className="px-2 pb-0">
        <ApexChart {...chartConfig} month={month} />
      </CardBody>
    </Card>
  );
}
