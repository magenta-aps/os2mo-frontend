/**
 * Removes all non-published classes from the classData array.
 *
 * @param {[]object} classData
 */
export function filter_remove_none_published(classData) {
  if (classData === undefined) {
    return classData
  }
  return classData.filter((c) => c !== null && c.published !== "IkkePubliceret")
}
