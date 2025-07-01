'use client'

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Perfil</h1>
      <div className="bg-white shadow rounded p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
          <div>
            <p className="text-lg font-semibold">Nombre de usuario</p>
            <p className="text-sm text-gray-500">Ciudad, País</p>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input type="text" className="mt-1 w-full border rounded px-3 py-2" placeholder="Nombre" />
          </div>
          <div>
            <label className="block text-sm font-medium">Apellido</label>
            <input type="text" className="mt-1 w-full border rounded px-3 py-2" placeholder="Apellido" />
          </div>
          <div>
            <label className="block text-sm font-medium">Ciudad</label>
            <input type="text" className="mt-1 w-full border rounded px-3 py-2" placeholder="Ciudad" />
          </div>
          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea className="mt-1 w-full border rounded px-3 py-2" rows={4} placeholder="Cuéntanos algo sobre ti" />
          </div>
        </form>
      </div>
    </div>
  )
}
