/**
 * Fetches the watering value in liters for a tree.
 * Currently this fetches the waterings of the past 60 days.
 * 2024-07-11: This project is about to be archived.
 * For archiving purposes, we make the project independent of the backend, database and vector tiles.
 * For some trees, we return a random value as mocked demo data.
 * @param treeId string
 * @param csrfToken string
 * @returns number | undefined
 */
export const getWateringValue = async (
  treeId: string
): Promise<number | undefined> => {
  if (!treeId) return

  if (Math.random() < 0.5) {
    return Math.round(50 + Math.random() * 500)
  }
}
