function calculatePoints(trashItems) {
  const total = trashItems
    .map((trashItem) => trashItem.modifier * trashItem.weight * 100)
    .reduce((acc, reducer) => acc + reducer);
  return Math.ceil(total);
}

module.exports = { calculatePoints };
