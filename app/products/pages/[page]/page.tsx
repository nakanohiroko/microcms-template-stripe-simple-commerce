import { Products } from '../../../components/Products'

export default async function Home({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-8'>
      <div className='text-center mb-12 animate-slide-up'>
        <h1 className='text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-focus bg-clip-text text-transparent'>
          商品一覧
        </h1>
        <p className='text-lg text-base-content/70 max-w-2xl mx-auto'>
          ページ {page}
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
        <Products offset={Number(page) - 1} />
      </div>
    </div>
  )
}
