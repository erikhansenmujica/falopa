"use client";
import { Caca, User } from "@/lib/definitions";
import { useEffect, useState } from "react";
import UserComponent from "../../components/Ranking/User";
import Loader from "@/components/Loader";
import WeekChart from "@/components/Charts/WeekChart";
import HistoricChart from "@/components/Charts/HistoricChart";
import HistoricChartCumulative from "@/components/Charts/HistoricChartCumulative";
import {
  Card,
  CardBody,
  CardHeader,
  ThemeProvider,
  Typography,
} from "@material-tailwind/react";

export default () => {
  const [participants, setParticipants] =
    useState<{ name: string; cacas: Caca[] }[]>();
  const [totalshits, settotalshits] = useState<Caca[]>();
  const [load, setLoad] = useState<boolean>(false);
  const [semana, setSemana] = useState<any[]>();
  const [month, setMonth] = useState<any>();

  async function getUsers() {
    setLoad(true);
    const res = await fetch("/caca/api/allusers");
    const totalshits = await fetch("/caca/api/allcacas");
    const totalfinalshits = await totalshits.json();
    settotalshits(totalfinalshits);
    const users = await res.json();
    const shitres = await Promise.all(
      users.map((u: { name: string }) =>
        fetch("/caca/api/cacasfromuser/" + u.name)
      )
    );
    // Aca me podes agarrar las dos pelotas
    totalfinalshits && filterDays(totalfinalshits, users);
    totalfinalshits && filterHours(totalfinalshits);
    totalfinalshits && filterMonth(totalfinalshits, users);
    const shits = await Promise.all(shitres.map((r) => r.json()));
    setParticipants(
      shits.sort((a, b) => {
        if (a.cacas.length > b.cacas.length) {
          return -1;
        } else {
          return 1;
        }
      })
    );
    setLoad(false);
  }

  useEffect(() => {
    getUsers();
  }, []);

  function getChamp() {
    return participants
      ? participants.reduce((a, b) => {
          if (a.cacas.length > b.cacas.length) {
            return a;
          } else {
            return b;
          }
        }).cacas.length
      : 0;
  }

  function filterHours(cacas: Caca[]) {
    // filtrado por horas del dia
    let hours = cacas.reduce((a: { [n: string]: Caca[] }, b) => {
      let date = String(b.date).split("T")[1].split(".")[0];
      date = date.slice(0, 2);
      if (a[date]) {
        a[date].push(b);
      } else {
        a[date] = [];
        a[date].push(b);
      }
      return a;
    }, {});

    let horas = new Array(24);
    hours = Object.fromEntries(
      Object.entries(hours).map(([key, value]) => [parseInt(key, 10), value])
    );
    for (let i = 0; i < horas.length; i++) {
      hours[i] = hours[i] || [];
      horas[i] = hours[i].reduce((n, d) => {
        const userId = d.userid;
        if (n.has(userId)) {
          n.set(userId, n.get(userId) + 1);
        } else {
          n.set(userId, 1);
        }
        return n;
      }, new Map());
    }
    // Aca te devuelve las horas y los usuarios que cagaron en esa hora
    return horas;
  }
  function filterMonth(cacas: Caca[], users: User[]) {
    let date = "";
    let counter = 0;
    let month = cacas.reduce(
      (
        a: { [n: string]: { [n: string]: { name: string; cacas: number }[] } },
        b
      ) => {
        if (
          date !==
          String(new Date(b.date).getDate()) +
            "/" +
            String(new Date(b.date).getMonth() + 1)
        ) {
          counter += 1;
        }
        date =
          String(new Date(b.date).getDate()) +
          "/" +
          String(new Date(b.date).getMonth() + 1);
        if (a[counter]) {
          const cago = a[counter][String(new Date(b.date).getDate())].filter(
            (cagadas) => cagadas.name === b.userid
          );
          if (cago.length) {
            cago[0].cacas += 1;
          } else
            a[counter][String(new Date(b.date).getDate())].push({
              name: b.userid,
              cacas: 1,
            });
        } else {
          a[counter] = {
            [String(new Date(b.date).getDate())]: [
              { name: b.userid, cacas: 1 },
            ],
          };
        }
        return a;
      },
      {}
    );
    for (const day in month) {
      const noestan = users.filter((person) => {
        let date = Object.keys(month[day])[0];
        let count = 0;
        month[day][date].forEach((cagadoreneldia) => {
          if (person.name === cagadoreneldia.name) {
            count += 1;
          }
        });
        return !count;
      });
      if (noestan.length) {
        let date = Object.keys(month[day])[0];
        const ar = month[day][date];
        month[day][date] = [
          ...ar,
          ...noestan.map((u) => ({ name: u.name, cacas: 0 })),
        ];
      }
    }
    setMonth(month);
  }
  function filterDays(cacas: Caca[], users: User[]) {
    // De domingo(0) a sabado(6)
    const days = cacas.reduce((a: { [n: string]: Caca[] }, b) => {
      const date = String(new Date(b.date).getDay());

      if (a[date]) {
        a[date].push(b);
      } else {
        a[date] = [];
        a[date].push(b);
      }

      return a;
    }, {});

    let semana = new Array(7);
    for (let i = 0; i < 7; i++) {
      semana[i] = days[i].reduce((n, d) => {
        const userId = d.userid;
        if (n.has(userId)) {
          n.set(userId, n.get(userId) + 1);
        } else {
          n.set(userId, 1);
        }
        return n;
      }, new Map());
    }
    semana = semana.map((cagadoreseneldia: Map<string, number>) => {
      if (users) {
        const noestan = users.filter((p) => {
          let count = 0;
          cagadoreseneldia.forEach((value, chabon) => {
            if (chabon === p.name) {
              count += 1;
            }
          });
          return !count;
        });
        noestan.forEach((element) => {
          cagadoreseneldia.set(element.name, 0);
        });
        return cagadoreseneldia;
      }
    });
    // Aca te devuelve la semana entera con los usuarios y la cantidad de cagadas
    setSemana(semana);
  }

  return (
    <ThemeProvider>
      <div className="w-screen">
        <Card placeholder={""} className="rounded-none flex flex-col">
          <Typography
            placeholder=""
            variant="h1"
            color="black"
            className="text-center text-black"
          >
            Cagos Globales {totalshits?.length}
          </Typography>
          <CardHeader
            placeholder={""}
            floated={false}
            shadow={false}
            color="transparent"
            className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
          >
            <div>
              <Typography placeholder={""} variant="h6" color="blue-gray">
                EL MÁS CULO FLOJO
              </Typography>
              <Typography
                placeholder={""}
                variant="small"
                color="gray"
                className="max-w-sm font-normal"
              >
                Ranking de los que tienen la cola más suelta.
              </Typography>
            </div>
          </CardHeader>
          <CardBody
            placeholder={""}
            className="px-2 pb-0 w-[85%] self-center flex flex-col gap-4"
          >
            {load ? (
              <Loader />
            ) : (
              participants &&
              participants.map((u, i) => (
                <UserComponent
                  key={u.name}
                  name={u.name}
                  cacas={u.cacas}
                  position={i + 1}
                  totalcacas={totalshits ? totalshits.length : 0}
                  champ={getChamp()}
                />
              ))
            )}
          </CardBody>
        </Card>
        <HistoricChart month={month ? month : []} />
        <HistoricChartCumulative month={month ? month : []} />
        <WeekChart semana={semana ? semana : []} />
      </div>
    </ThemeProvider>
  );
};
