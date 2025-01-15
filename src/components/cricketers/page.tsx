import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TPlayerType, TPlayer } from "@/apis/types";
import getPlayers from "@/apis/get-players";

export default function CricketersList() {
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getPlayers()
      .then((players) => {
        const updatedPlayers = players.map((player) => {
          const dob = new Date(player.dob);
          const age = new Date().getFullYear() - dob.getFullYear();
          return { ...player, age };
        });
        console.log(updatedPlayers);
        setPlayers(updatedPlayers);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <div className="container mx-auto py-10">
      {!!players.length && <DataTable columns={columns} data={players} />}
      {error && <p>{error}</p>}
    </div>
  );
}
