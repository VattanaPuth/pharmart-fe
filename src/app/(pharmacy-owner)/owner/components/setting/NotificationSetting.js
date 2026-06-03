import { Bell } from "lucide-react"
export function NotificationSetting(){
    return (
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-pink-100 p-2 text-pink-500">
                <Bell size={16} />
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                Notifications
              </h2>
            </div>

            <div className="space-y-6">

              {/* Notification 1 */}
              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Email notifications for new orders
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Get an email whenever a new order is placed
                  </p>
                </div>

                <button className="relative h-6 w-11 rounded-full bg-pink-500">
                  <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                </button>
              </div>

              {/* Notification 2 */}
              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Email notifications for low stock alerts
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Get an email when a product falls below its stock threshold
                  </p>
                </div>

                <button className="relative h-6 w-11 rounded-full bg-gray-200">
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </div>
    )
}