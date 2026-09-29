$ErrorActionPreference='Stop'
$log='C:\Users\RDC-GUEST\Documents\KravMaga\kravmaga-turk-website\online-akademi-v2\transcode-selected.log'
if(-not (Select-String -LiteralPath $log -Pattern '^COMPLETE ' -Quiet)){throw 'Transcode batch is not complete yet'}
$root='C:\Users\RDC-GUEST\Documents\KravMaga\prepared-media'
$renames=@{
 'basic\tek-el-sald-r.mp4'='basic\tek-el-saldiri.mp4'
 'basic\yerde-sald-r.mp4'='basic\yerde-saldiri.mp4'
 'tekme\d-ner-tekme.mp4'='tekme\doner-tekme.mp4'
 'yer\d-me.mp4'='yer\dusme.mp4'
 'yer\tekme-tutulmas.mp4'='yer\tekme-tutulmasi.mp4'
 'yer\d-rme.mp4'='yer\dusurme.mp4'
 'yer\yandan-sald-r.mp4'='yer\yandan-saldiri.mp4'
 'kilit\iki-el-ile-tutu.mp4'='kilit\iki-el-ile-tutus.mp4'
}
foreach($k in $renames.Keys){
 $src=Join-Path $root $k;$dst=Join-Path $root $renames[$k]
 if(Test-Path -LiteralPath $src){Move-Item -LiteralPath $src -Destination $dst -Force}
}
$ff='C:\Users\RDC-GUEST\Documents\KravMaga\tools\ffmpeg\ffmpeg-9.0.2-essentials_build\bin\ffprobe.exe'
$rows=@()
Get-ChildItem -LiteralPath $root -Recurse -File -Filter *.mp4 | Sort-Object FullName | ForEach-Object {
  $json=& $ff -v quiet -print_format json -show_format -show_streams $_.FullName | Out-String | ConvertFrom-Json
  $v=$json.streams|Where-Object {$_.codec_type -eq 'video'}|Select-Object -First 1
  $a=$json.streams|Where-Object {$_.codec_type -eq 'audio'}|Select-Object -First 1
  $rows += [ordered]@{
    relative=$_.FullName.Substring($root.Length+1).Replace('\','/')
    sizeBytes=$_.Length
    durationSec=[math]::Round([double]$json.format.duration,2)
    videoCodec=$v.codec_name
    audioCodec=$a.codec_name
    width=$v.width
    height=$v.height
    browserReady=($v.codec_name -eq 'h264' -and $a.codec_name -eq 'aac')
  }
}
$out='C:\Users\RDC-GUEST\Documents\KravMaga\kravmaga-turk-website\online-akademi-v2\prepared-media-verified.json'
$rows | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $out -Encoding UTF8
$bad=$rows|Where-Object {-not $_.browserReady}
Write-Output ('FILES='+$rows.Count+' BAD='+$bad.Count)
