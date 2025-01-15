import data from "./players";
import { TMayBe, TPlayer } from "./types";

let timer: NodeJS.Timeout = undefined;

const getPlayer = (id?: TMayBe<string>): Promise<TMayBe<TPlayer>> => {
  clearTimeout(timer);

  const player = (data as TPlayer[]).find((it) => it.id === id);

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      clearTimeout(timer);

      if (Math.floor(Math.random() * (50 - 1 + 1) + 1) % 7 === 0) {
        reject(new Error("Some error occurred!"));
      } else {
        resolve(player);
      }
    }, Math.floor(Math.random() * (2000 - 100 + 1) + 100));
  });
};

export default getPlayer;
