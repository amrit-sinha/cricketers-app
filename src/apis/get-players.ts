import data from "./players";
import { TMayBe, TPlayer, TPlayerType } from "./types";

let timer: NodeJS.Timeout = undefined;

const getPlayers = (args?: {
  type?: TMayBe<TPlayerType>;
}): Promise<TPlayer[]> => {
  clearTimeout(timer);

  const players = (data as TPlayer[])
    .sort((a, b) => {
      const aPoints = a.points ?? 0;
      const bPoints = b.points ?? 0;

      return aPoints === bPoints ? 0 : bPoints > aPoints ? 1 : -1;
    })
    .map((it, index) => ({
      ...it,
      rank: index + 1,
    }))
    .filter((it) => (args?.type ? it.type === args?.type : true))
    .slice(0, Math.floor(Math.random() * (data.length - 8 + 1) + 8));

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      clearTimeout(timer);

      if (Math.floor(Math.random() * (50 - 1 + 1) + 1) % 7 === 0) {
        reject(new Error("Some error occurred!"));
      } else {
        resolve(players);
      }
    }, Math.floor(Math.random() * (3000 - 100 + 1) + 100));
  });
};

export default getPlayers;
