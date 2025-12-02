export function getLimitAndOffset({ page = 0, size = 10 }) {
  if (isNaN(parseInt(page))) {
    throw new Error("getPaginationObject Error: page must be a number.");
  }
  if (isNaN(parseInt(size))) {
    throw new Error("getPaginationObject Error: size must be a number.");
  }

  if (page < 0) {
    page = 0;
  }

  const limit = size;
  const offset = page * size;

  return [limit, offset];
}

export function getPaginationObject({ page = 0, size = 10, total = 0 }) {
  if (isNaN(parseInt(page))) {
    throw new Error("getPaginationObject Error: page must be a number.");
  }
  if (isNaN(parseInt(size))) {
    throw new Error("getPaginationObject Error: size must be a number.");
  }
  if (isNaN(parseInt(total))) {
    throw new Error("getPaginationObject Error: total must be a number.");
  }

  if (page < 0) {
    page = 0;
  }

  const lastPage = Math.max(Math.ceil(total / size) - 1, 0);
  return {
    total,
    lastPage,
    prevPage: page > 0 ? page - 1 : null,
    nextPage: page < lastPage ? page + 1 : null,
    perPage: size,
    currentPage: page,
  };
}
