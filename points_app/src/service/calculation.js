function calculatePoints(trashItems) {
  return trashItems
    .map((trashItem) => trashItem.modifier * trashItem.weight * 100)
    .reduce((acc, reducer) => acc + reducer);
}

module.exports = { calculatePoints };
