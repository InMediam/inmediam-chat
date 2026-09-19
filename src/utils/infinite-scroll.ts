interface GetNextPageParamProps {
  pageIndex: number
  perPage: number
  totalCount: number
}

export function getNextPageParam({
  pageIndex,
  perPage,
  totalCount,
}: GetNextPageParamProps) {
  const totalPages = Math.ceil(totalCount / perPage)
  return pageIndex < totalPages ? pageIndex + 1 : undefined
}
