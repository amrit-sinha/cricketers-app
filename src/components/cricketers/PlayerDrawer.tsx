import { useEffect, useState } from "react";
import { Button } from "../ui/button";
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

const PlayerDrawer = ({ name }: { name: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(`drawerState-${name}`);
    if (savedState) {
      setIsOpen(JSON.parse(savedState));
    }
  }, [name]);

  const handleOpen = () => {
    setIsOpen(true);
    localStorage.setItem(`drawerState-${name}`, JSON.stringify(true));
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(`drawerState-${name}`, JSON.stringify(false));
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger onClick={handleOpen}>{name}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{name}</DrawerTitle>
            <DrawerDescription>Lorem Ipsum</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose onClick={handleClose}>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PlayerDrawer;
