export interface PaginationData<T = unknown> {
  data: T[]
  total: number
  take: number
  skip: number
}
