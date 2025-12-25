'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { MicroCMSImage } from 'microcms-js-sdk'

type ProductImageGalleryProps = {
  featuredImage?: MicroCMSImage
  images: Array<MicroCMSImage>
  productName: string
}

export function ProductImageGallery({
  featuredImage,
  images,
  productName,
}: ProductImageGalleryProps) {
  const allImages = featuredImage ? [featuredImage, ...images] : images
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (allImages.length === 0) {
    return null
  }

  const selectedImage = allImages[selectedImageIndex]

  return (
    <div className='space-y-4'>
      {/* メイン画像 */}
      <div className='relative aspect-square rounded-xl overflow-hidden bg-base-200 shadow-lg'>
        <Image
          src={selectedImage.url}
          alt={`Product image of ${productName}`}
          width={selectedImage.width}
          height={selectedImage.height}
          className='w-full h-full object-cover'
          priority={selectedImageIndex === 0}
        />
      </div>

      {/* サムネイルグリッド */}
      {allImages.length > 1 && (
        <div className='grid grid-cols-4 gap-2'>
          {allImages.map((image, index) => {
            const isSelected = index === selectedImageIndex
            return (
              <button
                key={image.url}
                type='button'
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden bg-base-200 border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary shadow-md'
                    : 'border-base-300 hover:border-primary/50'
                }`}
                aria-label={`${productName}の画像 ${index + 1}を表示`}
              >
                <Image
                  src={image.url}
                  alt={`${productName}のサムネイル画像 ${index + 1}`}
                  width={image.width}
                  height={image.height}
                  className='w-full h-full object-cover'
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
