import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { TPlayer, TPlayerType, TMayBe } from "@/apis/types";
import getPlayers from "@/apis/get-players";
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
) => {
  try {
    const players = await getPlayers({ type });
    return players
      .filter((player) => player.name !== excludeName)
      .map((player) => {
        return { name: player.name, points: player.points, rank: player.rank };
      });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const PlayerDrawer = ({ data }: { data: TPlayer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [similarPlayers, setSimilarPlayers] = useState<TPlayer[]>([]);

  const updatedData = {
    ...data,
    dob: new Date(Number(data.dob)).toLocaleDateString(),
    age: new Date().getFullYear() - new Date(Number(data.dob)).getFullYear(),
  };

  useEffect(() => {
    const savedState = localStorage.getItem(`drawerState-${updatedData.name}`);
    if (savedState) {
      setIsOpen(JSON.parse(savedState));
    }
  }, [updatedData.name]);

  const handleOpen = async () => {
    setIsOpen(true);
    try {
      const similarPlayersData = await fetchPlayers(data.type, data.name);
      setSimilarPlayers(
        similarPlayersData ? similarPlayersData.slice(0, 5) : []
      );
    } catch (error) {
      console.error("Failed to fetch similar players:", error);
    }
    localStorage.setItem(
      `drawerState-${updatedData.name}`,
      JSON.stringify(true)
    );
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
              {similarPlayers.length > 0 ? (
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
