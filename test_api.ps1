$loginBody = '{"email":"admin@socialsync.test","password":"admin123"}'
$loginRes = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -ContentType 'application/json' -Body $loginBody
$token = $loginRes.token
Write-Output "Login OK: $($loginRes.user.name) ($($loginRes.user.role))"

$headers = @{Authorization="Bearer $token"}

$dashRes = Invoke-RestMethod -Uri 'http://localhost:3001/api/analytics/dashboard' -Headers $headers
Write-Output "Dashboard Stats: Clients=$($dashRes.stats.activeClients), Scheduled=$($dashRes.stats.postsScheduled), Pending=$($dashRes.stats.pendingApprovals)"
Write-Output "Activity: $($dashRes.recentActivity.Count) items"

$postsRes = Invoke-RestMethod -Uri 'http://localhost:3001/api/posts' -Headers $headers
Write-Output "Posts: $($postsRes.posts.Count) total"

$clientsRes = Invoke-RestMethod -Uri 'http://localhost:3001/api/clients' -Headers $headers
Write-Output "Clients: $($clientsRes.clients.Count) total"
