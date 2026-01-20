import { connectToDatabase } from "@/lib/mongodb"
import { Item } from "@/models/Item"
import { Package, TrendingUp, FolderOpen, Clock } from "lucide-react"

async function getStats() {
  await connectToDatabase()
  
  const totalItems = await Item.countDocuments()
  const categories = await Item.distinct("category")
  const recentItems = await Item.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()

  return { totalItems, categoryCount: categories.length, recentItems }
}

export default async function AdminDashboard() {
  const { totalItems, categoryCount, recentItems } = await getStats()

  const stats = [
    { label: "Total Items", value: totalItems, icon: Package },
    { label: "Categories", value: categoryCount, icon: FolderOpen },
    { label: "This Month", value: totalItems, icon: TrendingUp },
  ]

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#0E2A47] mb-2">Dashboard</h1>
        <p className="text-[#0E2A47]/60 text-sm">Welcome back to Aura Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 border border-[#0E2A47]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-5 w-5 text-[#C9A24D]" />
              <span className="text-[10px] tracking-wider uppercase text-[#0E2A47]/50">
                {stat.label}
              </span>
            </div>
            <p className="font-serif text-4xl text-[#0E2A47]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Items */}
      <div className="bg-white border border-[#0E2A47]/10 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-4 w-4 text-[#C9A24D]" />
          <h2 className="font-serif text-xl text-[#0E2A47]">Recent Items</h2>
        </div>
        
        {recentItems.length > 0 ? (
          <div className="space-y-4">
            {recentItems.map((item: any) => (
              <div
                key={item._id.toString()}
                className="flex items-center gap-4 py-3 border-b border-[#0E2A47]/5 last:border-0"
              >
                {item.images?.[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-12 h-12 object-cover bg-[#F7F7F5]"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#0E2A47]">{item.title}</p>
                  <p className="text-xs text-[#0E2A47]/50 capitalize">
                    {item.category.replace(/-/g, " ")}
                  </p>
                </div>
                <p className="text-xs text-[#0E2A47]/40">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#0E2A47]/50 text-sm">No items yet. Add your first item!</p>
        )}
      </div>
    </div>
  )
}
