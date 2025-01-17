import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { TPlayer, TPlayerType, TMayBe } from "@/apis/types";
import getPlayers from "@/apis/get-players";
import { Skeleton } from "../ui/skeleton";
import { typeMap } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const fetchPlayers = async (
  type: TMayBe<TPlayerType>,
  excludeName: TMayBe<string>
): Promise<TPlayer[] | []> => {
  try {
    const players = await getPlayers({ type });
    return players
      .filter((player) => player.name !== excludeName)
      .map((player) => {
        return { name: player.name, points: player.points, rank: player.rank };
      });
  } catch (error) {
    console.error(error);
    return [];
  }
};

const PlayerDrawer = ({ data }: { data: TPlayer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [similarPlayers, setSimilarPlayers] = useState<TPlayer[]>(() => {
    const storedData = localStorage.getItem("similarPlayers");
    return storedData ? JSON.parse(storedData) : [];
  });

  const updatedData = {
    ...data,
    type: data.type ? typeMap[data.type] : "",
    dob: new Date(Number(data.dob)).toLocaleDateString(),
    age: new Date().getFullYear() - new Date(Number(data.dob)).getFullYear(),
  };

  useEffect(() => {
    const savedState = localStorage.getItem(`drawerState-${updatedData.name}`);
    if (savedState) {
      setIsOpen(JSON.parse(savedState));

      setLoading(true);
      const similarPlayersData = localStorage.getItem("similarPlayers");
      setSimilarPlayers(
        similarPlayersData ? JSON.parse(similarPlayersData) : []
      );
      setLoading(false);
    }
  }, [updatedData.name]);

  const handleOpen = async () => {
    setIsOpen(true);
    setLoading(true);
    localStorage.setItem(
      `drawerState-${updatedData.name}`,
      JSON.stringify(true)
    );

    let similarPlayersData = await fetchPlayers(data.type, data.name);
    similarPlayersData = similarPlayersData.slice(0, 5);
    setSimilarPlayers(similarPlayersData);
    localStorage.setItem("similarPlayers", JSON.stringify(similarPlayersData));
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(
      `drawerState-${updatedData.name}`,
      JSON.stringify(false)
    );
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen} onClose={handleClose}>
        <DrawerTrigger onClick={handleOpen}>{updatedData.name}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex justify-center">
              {updatedData.name}
            </DrawerTitle>
            <DrawerDescription className="flex justify-center text-base italic text-gray-800 my-4">
              {updatedData.description}
            </DrawerDescription>
            <DrawerDescription className="flex justify-center gap-4 text-base text-gray-800">
              <span>Type: {updatedData.type}</span>
              <span>Points: {updatedData.points}</span>
              <span>Rank: {updatedData.rank}</span>
              <span>Date of Birth: {updatedData.dob}</span>
              <span>Age: {updatedData.age}</span>
            </DrawerDescription>
          </DrawerHeader>

          <DrawerHeader>
            <DrawerTitle>Similar Players</DrawerTitle>
            <DrawerDescription className="flex flex-col gap-2">
              {loading ? (
                <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ) : similarPlayers.length > 0 ? (
                <ol className="list-decimal pl-6">
                  {similarPlayers.map((player, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-bold">{player.name} : </span>{" "}
                      <span>
                        Rank - {player.rank}, Points - {player.points}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <span>No similar players found.</span>
              )}
            </DrawerDescription>
          </DrawerHeader>

          <DrawerFooter>
            <DrawerClose onClick={handleClose}>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PlayerDrawer;
