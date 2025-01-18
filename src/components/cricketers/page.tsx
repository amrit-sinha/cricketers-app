import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TPlayer } from "@/apis/types";
import getPlayers from "@/apis/get-players";
import { Button } from "../ui/button";
import { RefreshCw, Sun, Moon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "@/components/ui/switch"; // Adjust the import path as needed

/** Main component displaying the Indian Cricket Team roster */
export default function CricketersList() {
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  /** Fetches the players from the get-players api */
  const fetchPlayers = () => {
    setLoading(true);
    getPlayers()
      .then((players) => {
        const updatedPlayers = players.map((player) => {
          const dob = new Date(Number(player.dob));
          const age = new Date().getFullYear() - dob.getFullYear();
          return { ...player, age };
        });
        setPlayers(updatedPlayers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching players: ", error);
        setLoading(false);
      });
  };

  /** Refreshes the players list */
  const handleRefresh = () => {
    setPlayers([]);
    fetchPlayers();
  };

  /** Toggles dark mode */
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold inline-block px-6 py-3 border-2 border-border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:text-white">
          Indian Cricket Team
        </h1>
        <div className="flex justify-between items-center gap-8">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw />
          </Button>
          <div className="flex items-center gap-2">
            <Sun />
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            <Moon />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[600px]" />
            <Skeleton className="h-4 w-[500px]" />
            <Skeleton className="h-4 w-[400px]" />
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={players} />
      )}
    </div>
  );
}
