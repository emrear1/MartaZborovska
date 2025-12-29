# Video Setup Instructions

## Adding Your Intro Video

1. Create a folder called `videos` in the `public` directory:
   ```
   public/videos/
   ```

2. Place your intro video file (named `introFilm.mp4`) in this folder:
   ```
   public/videos/introFilm.mp4
   ```

3. The video will automatically play as the background on the home page.

## Video Requirements

- **Format**: MP4 (H.264 codec recommended)
- **Recommended Resolution**: 1920x1080 or higher
- **File Size**: Keep it optimized (under 10MB if possible)
- **Duration**: Can be any length (will loop automatically)

## Alternative Video Formats

If you need to use a different video format or name, edit `src/pages/Home.js` and update the video source path:

```jsx
<source src="/videos/your-video-name.mp4" type="video/mp4" />
```

## Admin Panel

Access the admin panel at: `/admin`

From there you can:
- Upload photos and videos
- Edit titles and categories
- Delete items
- Manage your portfolio content

Note: Currently, uploaded files are stored in browser localStorage. For production, you'll want to integrate with a backend API and file storage service.

