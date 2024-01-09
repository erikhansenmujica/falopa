"use client";
import { Caca, User } from "@/lib/definitions";
import { useEffect, useState } from "react";
import UserComponent from "./User";
import Loader from "@/components/Loader";

export default () => {
  const [participants, setParticipants] =
    useState<{ name: string; cacas: Caca[] }[]>();
  const [totalshits, settotalshits] = useState<Caca[]>();
  const [load, setLoad] = useState<boolean>(false);
  async function getUsers() {
    setLoad(true);
    const res = await fetch("/caca/api/allusers");
    const totalshits = await fetch("/caca/api/allcacas");
    settotalshits(await totalshits.json());
    const users = await res.json();
    const shitres = await Promise.all(
      users.map((u: { name: string }) =>
        fetch("/caca/api/cacasfromuser/" + u.name)
      )
    );
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
  return (
    <div className="w-screen">
      <h1>PUTO EL QUE LEE</h1>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {totalshits?.length} cagos globales
      </p>
      <div className="flex items-center mt-4 flex-col w-full justify-center align-center">
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
            />
          ))
        )}
      </div>
    </div>
  );
};
