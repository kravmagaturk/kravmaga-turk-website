param(
  [string]$Catalog = (Join-Path (Split-Path $PSScriptRoot -Parent) 'catalog-v3.json'),
  [string]$Worker = 'https://kravmaga-online-video.bulicet.workers.dev'
)
$ErrorActionPreference='Stop'
$base=Split-Path $PSScriptRoot -Parent
$workerDir=Join-Path $base 'worker'
$j=Get-Content -LiteralPath $Catalog -Raw -Encoding UTF8 | ConvertFrom-Json
$lessons=@(); foreach($s in $j.sections){foreach($m in $s.modules){foreach($l in $m.lessons){$lessons += $l}}}
$now=[DateTime]::UtcNow.ToString('o')
$exp=[DateTimeOffset]::UtcNow.AddMinutes(15).ToUnixTimeMilliseconds()
$uid='selftest-media-audit'
$tickets=@()
$sql=@("PRAGMA foreign_keys=ON;","INSERT OR REPLACE INTO users(uid,email,display_name,role,status,created_at,last_login_at) VALUES('$uid','selftest@local','Media Audit','pending','active','$now','$now');")
foreach($l in $lessons){$t=[guid]::NewGuid().ToString();$tickets += [pscustomobject]@{id=[string]$l.id;ticket=$t};$sql += "INSERT OR REPLACE INTO video_tickets(ticket,uid,video_id,expires_at,created_at) VALUES('$t','$uid','$($l.id)',$exp,'$now');"}
$tmp=Join-Path $env:TEMP ('academy-audit-'+[guid]::NewGuid().ToString()+'.sql')
Set-Content -LiteralPath $tmp -Value $sql -Encoding UTF8
Push-Location $workerDir
try { & 'C:\Program Files\nodejs\npx.cmd' wrangler d1 execute kravmaga-online-akademi --remote --file $tmp | Out-Null } finally { Pop-Location; Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue }
$ok=0;$bad=@()
foreach($x in $tickets){
  $url=$Worker+'/api/video/'+[uri]::EscapeDataString($x.id)+'?ticket='+[uri]::EscapeDataString($x.ticket)
  $code=& curl.exe -sS -o NUL -I -w '%{http_code}' $url
  if($code -eq '200' -or $code -eq '206'){$ok++}else{$bad += [pscustomobject]@{id=$x.id;status=$code}}
}
$cleanup="DELETE FROM video_tickets WHERE uid='$uid'; DELETE FROM users WHERE uid='$uid';"
Push-Location $workerDir; try { & 'C:\Program Files\nodejs\npx.cmd' wrangler d1 execute kravmaga-online-akademi --remote --command $cleanup | Out-Null } finally { Pop-Location }
Write-Output ('MEDIA_OK='+$ok+' TOTAL='+$tickets.Count+' BAD='+$bad.Count)
if($bad.Count){$bad|Format-Table -AutoSize; exit 2}