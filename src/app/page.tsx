import Link from 'next/link'

export default function HomePage() {
  // For now, we'll use static data since we haven't set up the database yet
  // Once you have PostgreSQL running, we'll connect it
  const items: any[] = []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">YakCat Marketplace</h1>
        <div className="space-x-4">
          <Link 
            href="/items/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Item
          </Link>
          <Link 
            href="/quick-capture" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Quick Capture
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No items yet</p>
          <Link 
            href="/items/new"
            className="text-blue-600 hover:underline"
          >
            Add the first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link 
              key={item.id} 
              href={`/items/${item.slug}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gray-100">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0].url}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
                  {item.price && (
                    <p className="text-green-600 font-bold">${item.price}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    by {item.vendor?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}