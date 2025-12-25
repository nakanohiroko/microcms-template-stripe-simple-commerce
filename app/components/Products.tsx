import Link from 'next/link'
import Image from 'next/image'
import { listProducts } from '../libs/microcms'
import { Suspense } from 'react'
import { Pagination } from './layouts/Pagenation'

export async function Products({ offset }: { offset?: number }) {
  const { contents: products, ...args } = await listProducts({ offset })
  const { totalCount, limit } = args
  return (
    <Suspense fallback={<div className='flex justify-center items-center min-h-[400px]'><span className='loading loading-spinner loading-lg'></span></div>}>
      {products.map((product, index) => {
        return (
          <section
            key={product.id}
            className='group bg-base-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-300 animate-fade-in'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {product.featured_image ? (
              <Link href={`/products/${product.id}`} className='block overflow-hidden'>
                <div className='relative aspect-square overflow-hidden bg-base-200'>
                  <Image
                    src={product.featured_image.url}
                    alt={`Product image of ${product.name}`}
                    width={product.featured_image.width}
                    height={product.featured_image.height}
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>
              </Link>
            ) : null}
            <div className='p-6'>
              <h2 className='text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem]'>
                <Link
                  href={`/products/${product.id}`}
                  className='hover:text-primary transition-colors duration-200'
                >
                  {product.name}
                </Link>
              </h2>

              <form action={`/api/${product.id}/checkout`} method='POST'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4'>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-2xl font-bold text-primary'>
                      {product.price.toLocaleString()}
                    </span>
                    <span className='text-base text-base-content/70'>
                      {product.currency[0]}
                    </span>
                  </div>

                  <button
                    type='submit'
                    className='btn btn-primary w-full sm:w-auto min-w-[120px] hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mr-2'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                      aria-hidden='true'
                      focusable='false'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                      />
                    </svg>
                    購入する
                  </button>
                </div>
                <input type='hidden' name='amount' value={product.price} />
                <input type='hidden' name='currency' value={product.currency} />
                <input type='hidden' name='name' value={product.name} />
                {product.featured_image ? (
                  <input type='hidden' name='image' value={product.featured_image.url} />
                ) : null}
              </form>
            </div>
          </section>
        )
      })}
      <div className='col-span-full flex justify-center mt-12'>
        <Pagination totalCount={totalCount} limit={limit} />
      </div>
    </Suspense>
  )
}
