import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import ShareButton from '@/components/ShareButton'
import MessageButton from '@/components/MessageButton'

async function getItem(slug: string) {
  // Return mock data if no database
  if (!prisma) {
    return null
  }
  
  const item = await prisma.item.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      vendor: true,
      tags: {
        include: { tag: true }
      }
    }
  })
  
  if (item) {
    // Increment view count
    await prisma.item.update({
      where: { id: item.id },
      data: { viewCount: item.viewCount + 1 }
    })
  }
  
  return item
}

export default async function ItemDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await getItem(slug)
  
  if (!item) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Items
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div>
          {item.images.length > 0 ? (
            <div className="space-y-4">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.images[0].url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.slice(1).map((image: any, index: number) => (
                    <div key={image.id} className="aspect-square relative bg-gray-100 rounded overflow-hidden">
                      <img
                        src={image.url}
                        alt={`${item.title} ${index + 2}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No images</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
          
          {item.price && (
            <p className="text-2xl text-green-600 font-bold mb-4">
              ${item.price.toFixed(2)}
            </p>
          )}

          <div className="flex gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              item.status === 'AVAILABLE' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item.status}
            </span>
            <span className="text-gray-500 text-sm">
              {item.viewCount} views
            </span>
          </div>

          {item.description && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>
          )}

          {item.location && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Location</h3>
              <p className="text-gray-700">{item.location}</p>
            </div>
          )}

          {item.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(({ tag }: any) => (
                  <span 
                    key={tag.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4 mb-6">
            <p className="text-sm text-gray-500">
              Posted by {item.vendor.name || 'Unknown'} on{' '}
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <MessageButton 
              vendorId={item.vendorId}
              vendorName={item.vendor.name || 'Vendor'}
              itemTitle={item.title}
            />
            <ShareButton 
              url={`/items/${item.slug}`}
              title={item.title}
              description={item.description}
            />
          </div>

          {item.contactInfo && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-1">Contact Information</h3>
              <p>{item.contactInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}