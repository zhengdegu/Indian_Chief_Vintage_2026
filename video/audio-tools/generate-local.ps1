# Offline fallback for an account without OpenAI API credit.
# This script uses Windows speech synthesis only; it never reads a credential.
param([string]$Voice = 'Microsoft Kangkang', [int]$Rate = -1)
$ErrorActionPreference = 'Stop'
$videoRoot = Split-Path -Parent $PSScriptRoot
$contentPath = Join-Path $videoRoot 'content.json'
$content = Get-Content -LiteralPath $contentPath -Raw -Encoding UTF8 | ConvertFrom-Json
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice($Voice)
$synth.Rate = $Rate
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(48000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
try {
    foreach ($scene in $content.scenes) {
        foreach ($segment in $scene.spokenSegments) {
            $destination = Join-Path (Join-Path $videoRoot 'public') $segment.file
            [System.IO.Directory]::CreateDirectory((Split-Path -Parent $destination)) | Out-Null
            $synth.SetOutputToWaveFile($destination, $format)
            $synth.Speak([string]$segment.text)
            $synth.SetOutputToNull()
            Write-Output ('Created ' + $segment.file)
        }
    }
} finally {
    $synth.Dispose()
}
$content.narrationDisclosure = '旁白采用 Windows 中文合成语音。'
$content.tts = [pscustomobject]@{
    provider = 'Microsoft Windows offline speech synthesis'
    model = 'System.Speech.Synthesis'
    voice = $Voice
    rate = $Rate
    format = 'wav'
    generated = $true
    requestedProvider = 'OpenAI'
    fallbackReason = 'OpenAI API returned HTTP 429 credit_balance_exhausted; no OpenAI speech was generated.'
}
$json = $content | ConvertTo-Json -Depth 30
[System.IO.File]::WriteAllText($contentPath, $json, (New-Object System.Text.UTF8Encoding($false)))
