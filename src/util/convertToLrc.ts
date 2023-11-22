import LyricsData from '../models/LyricsData.ts'

export default function convertToLRC(lyricsData: LyricsData) {
    const formatTime = (ms: string) => {
        const totalSeconds = parseInt(ms, 10) / 1000;
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        const milliseconds = ms.substring(ms.length - 3).padStart(2, '0');
        return `[${minutes}:${seconds}.${milliseconds}]`;
    };

    const lrcLines = lyricsData.lyrics.lines.map(line => {
        const startTime = formatTime(line.startTimeMs);
        return `${startTime}${line.words}`;
    });

    return lrcLines.join('\n');
}