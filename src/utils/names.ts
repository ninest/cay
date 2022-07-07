import { faker } from "@faker-js/faker";

export const fakePlayerName = () => {
  return faker.animal.cat();
};

export const fakeRoomId = () => {
  return `${faker.color.human()}-${faker.color.human()}`
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/,/g, "")
    .replace(/ /g, "-");
};
