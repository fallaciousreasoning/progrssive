let requested = false;

export const maybePerist = async () => {
    if (!('persist' in navigator.storage))
        return;

    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted && !requested) {
        await navigator.storage.persist().catch();
        requested = true;
    }
}