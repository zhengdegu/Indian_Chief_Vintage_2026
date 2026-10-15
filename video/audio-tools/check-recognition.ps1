# Independent offline dictation check. Technical terms may be mistranscribed.
$ErrorActionPreference = 'Stop'
$videoRoot = Split-Path -Parent $PSScriptRoot
Add-Type -AssemblyName System.Speech
$content = Get-Content -LiteralPath (Join-Path $videoRoot 'content.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$checks = @()
foreach ($scene in $content.scenes) {
    $recognizer = New-Object System.Speech.Recognition.SpeechRecognitionEngine([System.Globalization.CultureInfo]::GetCultureInfo('zh-CN'))
    try {
        $recognizer.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))
        $recognizer.SetInputToWaveFile((Join-Path (Join-Path $videoRoot 'public') $scene.audio))
        $results = @()
        while ($true) {
            try { $result = $recognizer.Recognize() }
            catch {
                if ($_.Exception.Message -like '*No audio input is supplied*') { break }
                throw
            }
            if (-not $result) { break }
            $results += [pscustomobject]@{text=$result.Text; confidence=$result.Confidence}
        }
        $checks += [pscustomobject]@{scene=$scene.id; intended=$scene.narration; recognized=$results}
    } finally {
        $recognizer.Dispose()
    }
}
$json = $checks | ConvertTo-Json -Depth 20
[System.IO.File]::WriteAllText((Join-Path $PSScriptRoot 'recognition-qa.json'), $json, (New-Object System.Text.UTF8Encoding($false)))
Write-Output $json
