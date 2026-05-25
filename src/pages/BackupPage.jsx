const exportBackup = () => {
  const data = {
  activities: JSON.parse(localStorage.getItem('chronoflow.activities.v1') || '[]'),
  entries: JSON.parse(localStorage.getItem('chronoflow.entries.v1') || '{}'),
  beast: JSON.parse(localStorage.getItem('chronoflow.beast.v1') || '{}'),
  beastGoals: JSON.parse(localStorage.getItem('chronoflow.beastGoals.v1') || '{}'),
}

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: 'application/json' }
  )

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `sufi-os-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()

  URL.revokeObjectURL(url)
}

const importBackup = async (event) => {
  const file = event.target.files[0]

  if (!file) return

  const text = await file.text()
  const data = JSON.parse(text)

 localStorage.setItem(
  'chronoflow.activities.v1',
  JSON.stringify(data.activities || [])
)

localStorage.setItem(
  'chronoflow.entries.v1',
  JSON.stringify(data.entries || {})
)

localStorage.setItem(
  'chronoflow.beast.v1',
  JSON.stringify(data.beast || {})
)

localStorage.setItem(
  'chronoflow.beastGoals.v1',
  JSON.stringify(data.beastGoals || {})
)
alert('Backup restored successfully.')

window.location.reload()
}

export default function BackupPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Backup
        </h1>

        <p className="text-sm text-zinc-400 mt-1">
          Export or restore your Sufi-OS data.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={exportBackup}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition"
        >
          Export Backup
        </button>

        <label className="cursor-pointer rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition">
          Import Backup

          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={importBackup}
          />
        </label>
      </div>
    </div>
  )
}