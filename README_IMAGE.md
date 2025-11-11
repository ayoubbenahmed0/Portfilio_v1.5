# Adding Your Profile Image

To add your profile image to the hero section:

1. Place your image in the `public` folder
2. Name it `profile.jpg` (or update the path in `src/components/Hero.tsx`)
3. Recommended size: 800x800px or larger (square aspect ratio works best)
4. Supported formats: JPG, PNG, WebP

The image will automatically:
- Display in a circular frame with glowing border
- Fall back to a 3D animated sphere if the image fails to load
- Include hover animations and effects

## Alternative Image Paths

If you want to use a different image path or name:
1. Update line 35 in `src/components/Hero.tsx`
2. Change `src="/profile.jpg"` to your desired path
3. You can also use external URLs (e.g., `src="https://your-image-url.com/profile.jpg"`)

## Image Optimization Tips

- Use WebP format for better compression
- Keep file size under 500KB for fast loading
- Use a square image (1:1 aspect ratio) for best results
- Ensure good lighting and professional appearance

