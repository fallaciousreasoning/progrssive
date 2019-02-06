export const randomItem = <T>(items: T[]) => {
    return items[Math.round(Math.random() * items.length)];
}

export const fakeName = () => {
    const names = ["Fred", "Jones", "Joe", "Bob", "Jane", "Doris", "Mary", "Sue", "Doe"];

    return `${randomItem(names)} ${randomItem(names)}`;
}