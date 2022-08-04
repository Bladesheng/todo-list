function arrayMove(array: any[], fromIndex: number, toIndex: number) {
  const item = array[fromIndex];
  array.splice(fromIndex, 1);
  array.splice(toIndex, 0, item);
}

// eslint-disable-next-line import/prefer-default-export
export { arrayMove };
