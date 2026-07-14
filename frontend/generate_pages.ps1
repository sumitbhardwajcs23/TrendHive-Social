$pages = @('InboxPage','MediaPage','TeamPage','AnalyticsPage','SettingsPage')
foreach($p in $pages) {
$content = @"
export default function ${p}() { 
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">${p}</h1>
      <p className="text-gray-500">Coming soon...</p>
    </div>
  ); 
}
"@
    Set-Content -Path "d:\SD\projects\socialAgency\frontend\src\pages\${p}.tsx" -Value $content
}
