# Video Files for Landing Page

This directory contains video files used on the landing page hero section.

## How to Add Your Video

**✅ Your video has been added!**

Your video file `Vidya-disha.mp4` has been copied to `public/videos/career-navigator-intro.mp4` and is now working on the landing page.

### To change/update your video:

1. **Replace the video file:**
   - Copy your new video to: `public/videos/career-navigator-intro.mp4`
   - Or use the copy command: `copy "path\to\your\video.mp4" "public\videos\career-navigator-intro.mp4"`

2. **Add a poster/thumbnail image (optional):**
   - Create a poster image (640x360 recommended)
   - Save it as: `public/career-navigator-poster.jpg`

3. **Video format recommendations:**
   - MP4 format (H.264 codec) works best
   - Keep file sizes under 50MB for web performance
   - Recommended resolution: 1920x1080 (Full HD) or 1280x720 (HD)

## Video Specifications

- **Format:** MP4 (H.264) and WebM
- **Resolution:** 1920x1080 (Full HD) or 1280x720 (HD)
- **Duration:** 30-60 seconds recommended
- **File size:** Keep under 50MB for web performance

## Example Video Content Ideas

- Introduction to Career Navigator platform
- Student success stories
- Platform features demonstration
- Career guidance testimonials
- College and course exploration walkthrough

## Alternative: YouTube/Vimeo Embed

If you prefer to use an external video platform, you can replace the video element with an iframe embed:

```html
<iframe
  width="100%"
  height="100%"
  src="c:\Users\sulem\Desktop\Vidya-disha.mp4"
  title="Career Navigator Introduction"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
```

## Current Implementation

The landing page currently includes:
- HTML5 video element with multiple source formats
- Custom play button overlay
- Responsive design
- Loading animations
- Error handling for unsupported browsers