import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { TPlayer } from "@/apis/types";
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

const PlayerDrawer = ({ data }: { data: TPlayer }) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleOpen = () => {
    setIsOpen(true);
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
  console.log(updatedData);

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
