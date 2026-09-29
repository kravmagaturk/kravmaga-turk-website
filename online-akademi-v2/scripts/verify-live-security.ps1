$ErrorActionPreference='Stop'
$worker='https://kravmaga-online-video.bulicet.workers.dev'
$page='https://kravmaga.com.tr/online-akademi'
$catalog='https://kravmaga.com.tr/online-akademi-katalog.json'
$h=& curl.exe -sS $page
$c=& curl.exe -sS $catalog
$j=$c | ConvertFrom-Json
$count=0; foreach($s in $j.sections){foreach($m in $s.modules){$count += $m.lessons.Count}}
$pcLeak=($h -match 'RDC-GUEST|OneDrive|C:\\Users') -or ($c -match 'RDC-GUEST|OneDrive|C:\\Users')
$b2Leak=($h -match 'backblazeb2|s3\.us-east') -or ($c -match 'backblazeb2|s3\.us-east')
$me=& curl.exe -sS -o NUL -w '%{http_code}' ($worker+'/api/me')
$direct=& curl.exe -sS -o NUL -w '%{http_code}' ($worker+'/api/video/bc-01')
$admin=& curl.exe -sS -o NUL -w '%{http_code}' ($worker+'/api/admin/users')
$order=($j.sections | ForEach-Object {$_.order.ToString()+':'+$_.title}) -join ' | '
$core=(($j.sections|Where-Object id -eq 'basic-combatives').modules|Where-Object id -eq 'core')
$bookOutside=@();foreach($s in $j.sections){foreach($m in $s.modules){foreach($l in $m.lessons){if($l.bookEligible -and $m.id -ne 'core'){$bookOutside+=$l.id}}}}
Write-Output ('LESSONS='+$count)
Write-Output ('ORDER='+$order)
Write-Output ('CORE='+$core.title+' BOOK='+(@($core.lessons|Where-Object bookEligible).Count))
Write-Output ('PC_LEAK='+$pcLeak+' B2_LEAK='+$b2Leak)
Write-Output ('ME='+$me+' DIRECT_VIDEO='+$direct+' ADMIN='+$admin)
Write-Output ('BOOK_OUTSIDE_CORE='+$bookOutside.Count)
if($count -ne 94 -or $pcLeak -or $b2Leak -or $me -ne '401' -or $direct -ne '401' -or $admin -ne '403' -or $bookOutside.Count -ne 0){exit 2}