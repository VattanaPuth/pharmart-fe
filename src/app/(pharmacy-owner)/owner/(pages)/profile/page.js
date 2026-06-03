// app/app-owner/profile/page.js

'use client'

import Link from 'next/link'

import {
  MapPin,
  Phone,
  Mail,
  Star,
  Plus,
  Pencil,
  ArrowLeft,
} from 'lucide-react'



const products = [
  {
    name: 'Amoxicillin Capsules',
    price: '$12.50',
    stock: '500mg • Capsule',
    image:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400',
    lowStock: false,
  },
  {
    name: 'Paracetamol Tablets',
    price: '$5.99',
    stock: '500mg • Tablet',
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400',
    lowStock: false,
  },
  {
    name: 'Vitamin D3 Softgels',
    price: '$18.99',
    stock: '100 IU • Softgel',
    image:
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400',
    lowStock: true,
  },
  {
    name: 'Loratadine Tablets',
    price: '$8.99',
    stock: '10mg • Tablet',
    image:
      'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=400',
    lowStock: true,
  },
]

const reviews = [
  {
    name: 'Alex Thompson',
    text: 'Great service and quality products. Highly recommend!',
    date: '3/2/2024',
  },
  {
    name: 'Sarah Chen',
    text: 'Very professional staff and fast delivery.',
    date: '1/15/2026',
  },
  {
    name: 'James Patel',
    text: 'Good range of products. Prices are fair.',
    date: '1/20/2026',
  },
  {
    name: 'Emily Watson',
    text: 'Product was good but delivery took longer than expected.',
    date: '2/1/2026',
  },
]

export default function ProfilePage() {
  return (
    <>
   
      <div className="min-h-screen bg-[#f6f7fb]">

        {/* Back */}
        <div className="px-6 pt-4">
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500">
            <ArrowLeft size={15} />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="mx-4 mt-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

            {/* Left */}
            <div className="flex items-center gap-4">

              <img
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=300"
                alt=""
                className="h-16 w-16 rounded-2xl object-cover"
              />

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  MediCare Pharmacy
                </h1>

                <div className="mt-3 flex flex-wrap gap-5 text-sm text-gray-500">

                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    st 310 toulkork , phnompenh
                  </div>

                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    012345667
                  </div>

                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    lang1612246@gmail.com
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile */}
            <Link
              href="settings"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Pencil size={15} />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">

          {/* Search */}
          <div className="mb-5 flex flex-col gap-3 md:flex-row">

            <input
              type="text"
              placeholder="Search products..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-pink-400"
            />

            <select className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 outline-none">
              <option>All Categories</option>
            </select>
          </div>

          {/* Products */}
          <div>

            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              6 Products
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

              {products.map((product, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md"
                >

                  {/* Image */}
                  <div className="relative flex h-44 items-center justify-center bg-gray-50 p-4">

                    {product.lowStock && (
                      <div className="absolute right-3 top-3 rounded-full bg-orange-100 px-2 py-1 text-[10px] font-medium text-orange-600">
                        Low Stock
                      </div>
                    )}

                    <img
                      src={product.image}
                      alt=""
                      className="h-28 object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-4">

                    <h3 className="line-clamp-1 text-sm font-semibold text-gray-800">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      {product.stock}
                    </p>

                    <div className="mt-4 flex items-center justify-between">

                      <div>
                        <p className="text-lg font-bold text-pink-500">
                          {product.price}
                        </p>

                        <p className="text-xs text-gray-400">
                          /Box
                        </p>
                      </div>

                      <button className="rounded-full bg-pink-500 p-2 text-white transition hover:bg-pink-600">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10">

            <h2 className="mb-5 text-2xl font-bold text-gray-800">
              Customer Reviews
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >

                  <div className="mb-3 flex items-start justify-between">

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {review.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {review.text}
                      </p>
                    </div>

                    <div className="flex text-yellow-400">
                      <Star size={15} fill="currentColor" />
                      <Star size={15} fill="currentColor" />
                      <Star size={15} fill="currentColor" />
                      <Star size={15} fill="currentColor" />
                      <Star size={15} fill="currentColor" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">
                    {review.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}