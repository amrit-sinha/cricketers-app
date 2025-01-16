import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TPlayerType, TPlayer } from "@/apis/types";
import getPlayers from "@/apis/get-players";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function CricketersList() {
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchPlayers = () => {
    setLoading(true);
    getPlayers()
      .then((players) => {
        const updatedPlayers = players.map((player) => {
          const dob = new Date(player.dob);
          const age = new Date().getFullYear() - dob.getFullYear();
          return { ...player, age };
        });
        setPlayers(updatedPlayers);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleRefresh = () => {
    setPlayers([]);
    fetchPlayers();
  };

  return (
    <div className="container mx-auto py-10">
      <Button variant="outline" size="icon" onClick={handleRefresh}>
        <RefreshCw />
      </Button>
      {loading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={players} />
      )}
    </div>
  );
}
