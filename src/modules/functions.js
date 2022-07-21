function arrayMove(array, fromIndex, toIndex) {
  const item = array[fromIndex];
  array.splice(fromIndex, 1);
  array.splice(toIndex, 0, item);
}

export {arrayMove}