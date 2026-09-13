/**
 * YouTube transcript service.
 * Fetches available captions/transcripts from YouTube videos.
 * Only processes legitimate youtube.com / youtu.be URLs (SSRF protection).
 */

// Strict YouTube URL allowlist
const YOUTUBE_DOMAINS = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com']

const YOUTUBE_VIDEO_REGEX =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/

export interface YouTubeTranscriptSegment {
  text: string
  start: number // seconds
  duration: number // seconds
}

/**
 * Validates a YouTube URL and extracts the video ID.
 * Throws if URL is not a valid YouTube video URL.
 */
export function extractVideoId(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('Invalid URL format.')
  }

  // SSRF / domain allowlist
  if (!YOUTUBE_DOMAINS.includes(parsed.hostname)) {
    throw new Error('Only YouTube URLs are supported.')
  }

  const match = url.match(YOUTUBE_VIDEO_REGEX)
  if (!match?.[1]) {
    throw new Error('Could not extract video ID from URL. Make sure it is a standard YouTube video link.')
  }

  return match[1]
}

/**
 * Fetches the transcript/captions for a YouTube video.
 * Returns null if no transcript is available.
 */
export async function fetchYouTubeTranscript(
  videoId: string
): Promise<YouTubeTranscriptSegment[] | null> {
  try {
    // Use the youtube-transcript package (fetches timedtext API)
    const { YoutubeTranscript } = await import('youtube-transcript')
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)

    if (!transcript || transcript.length === 0) return null

    return transcript.map((item) => ({
      text: item.text,
      start: item.offset / 1000, // offset is in ms, convert to seconds
      duration: item.duration / 1000,
    }))
  } catch (err: any) {
    // "Transcript not available" or video is private/restricted
    if (
      err?.message?.includes('Transcript is disabled') ||
      err?.message?.includes('Could not find') ||
      err?.message?.includes('No captions')
    ) {
      return null
    }
    throw err
  }
}

/**
 * Converts YouTube transcript segments to plain text for AI processing.
 */
export function transcriptToText(segments: YouTubeTranscriptSegment[]): string {
  return segments
    .map((seg) => seg.text.replace(/\n/g, ' ').trim())
    .filter(Boolean)
    .join(' ')
}

/**
 * Converts YouTube transcript segments to our internal segment format.
 */
export function youtubeSegmentsToInternal(
  segments: YouTubeTranscriptSegment[],
  meetingId: string,
  userId: string
) {
  return segments.map((seg, idx) => ({
    meeting_id: meetingId,
    user_id: userId,
    speaker: null,
    text: seg.text,
    start_time_ms: Math.round(seg.start * 1000),
    end_time_ms: Math.round((seg.start + seg.duration) * 1000),
    sequence_num: idx,
  }))
}
