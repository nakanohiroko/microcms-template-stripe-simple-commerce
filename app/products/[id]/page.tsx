import { getProductById } from '@/app/libs/microcms'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'


type PageProps = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    draft_key?: string
  }>
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id).catch(() => null)
  const { title } = await parent
  if (!product) {
    return {
      title,
    }
  }
  return {
    title: `${product.name} | ${title?.absolute}`,
  }
}

export default async function Product({ params, searchParams }: PageProps) {
  const { id: productId } = await params
  const searchParamsResolved = await searchParams
  let product = await getProductById(productId).catch(() => null)
  let draftKey: string | null = null
  if (!product) {
    draftKey = searchParamsResolved?.draft_key || null
    if (draftKey) {
      product = await getProductById(productId, {
        draftKey,
      }).catch(() => null)
    }
  }
  if (!product) {
    notFound()
  }
  return (
    <div className='max-w-7xl mx-auto px-4 py-8 animate-fade-in'>
      <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12'>
        {/* 商品画像セクション */}
        <div className='space-y-4'>
          {product.featured_image ? (
            <div className='relative aspect-square rounded-xl overflow-hidden bg-base-200 shadow-lg'>
              <Image
                src={product.featured_image.url}
                alt={`Product image of ${product.name}`}
                width={product.featured_image.width}
                height={product.featured_image.height}
                className='w-full h-full object-cover'
                priority
              />
            </div>
          ) : null}
          {product.images.length > 0 && (
            <div className='grid grid-cols-4 gap-2'>
              {product.images.map((image) => {
                return (
                  <div
                    key={image.url}
                    className='relative aspect-square rounded-lg overflow-hidden bg-base-200 border border-base-300 hover:border-primary transition-colors cursor-pointer'
                  >
                    <Image
                      src={image.url}
                      alt={`Product images of ${product?.name}`}
                      width={image.width}
                      height={image.height}
                      className='w-full h-full object-cover'
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 商品情報セクション */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-4xl lg:text-5xl font-bold mb-4 text-balance'>
              {product.name}
            </h1>
            <div className='flex items-baseline gap-3 mb-6'>
              <span className='text-4xl font-bold text-primary'>
                {product.price.toLocaleString()}
              </span>
              <span className='text-xl text-base-content/70'>
                {product.currency[0]}
              </span>
            </div>
          </div>

          {product.description ? (
            <div
              className='prose prose-lg max-w-none text-base-content/80'
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
          ) : null}

          <form action={`/api/${productId}/checkout`} method='POST' className='pt-6 border-t border-base-300'>
            <button
              disabled={!!draftKey}
              type='submit'
              className='btn btn-primary btn-lg w-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 mr-2'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              {draftKey ? '下書きモード' : '購入する'}
            </button>
            <input type='hidden' name='amount' value={product.price} />
            <input type='hidden' name='currency' value={product.currency} />
            <input type='hidden' name='name' value={product.name} />
            {product.featured_image ? (
              <input type='hidden' name='image' value={product.featured_image.url} />
            ) : null}
          </form>
        </div>
      </div>

      {/* 追加画像セクション */}
      {product.images.length > 0 && (
        <div className='mt-16'>
          <h2 className='text-3xl font-bold mb-8 text-center'>商品ギャラリー</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {product.images.map((image, index) => {
              return (
                <div
                  key={image.url}
                  className='relative aspect-square rounded-xl overflow-hidden bg-base-200 shadow-md hover:shadow-xl transition-all duration-300 group'
                >
                  <Image
                    src={image.url}
                    alt={`Product images of ${product?.name} - ${index + 1}`}
                    width={image.width}
                    height={image.height}
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
