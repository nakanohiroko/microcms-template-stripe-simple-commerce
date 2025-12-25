import Link from 'next/link'

export function Pagination({ totalCount, limit }: { totalCount: number; limit: number }) {
  const range = (start: number, end: number) => [...Array(end - start + 1)].map((_, i) => start + i)
  const totalPages = Math.ceil(totalCount / limit)

  if (totalPages <= 1) return null

  return (
    <div className='join shadow-md'>
      {range(1, totalPages).map((number, index) => (
        <Link
          key={index}
          href={`/products/pages/${number}`}
          className='join-item btn btn-outline hover:btn-primary transition-colors duration-200'
        >
          {number}
        </Link>
      ))}
    </div>
  )
}
