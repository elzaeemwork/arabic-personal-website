"""
Script to convert favicon.png to favicon.ico with proper multi-size support
"""
from PIL import Image
import os

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))
public_dir = os.path.join(script_dir, 'public')

# Input and output paths
input_path = os.path.join(public_dir, 'favicon.png')
output_path = os.path.join(public_dir, 'favicon.ico')

# Backup old favicon
old_size = os.path.getsize(output_path) if os.path.exists(output_path) else 0
print(f"Old favicon.ico size: {old_size} bytes")

print(f"Input: {input_path}")
print(f"Output: {output_path}")

# Open the PNG image
img = Image.open(input_path)
print(f"Original size: {img.size}")
print(f"Original mode: {img.mode}")

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Create multiple sizes for the ICO file (standard favicon sizes)
sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]

# Create images at each size
images = []
for size in sizes:
    resized = img.copy()
    resized.thumbnail(size, Image.Resampling.LANCZOS)
    # Create a new image with exact size and paste
    new_img = Image.new('RGBA', size, (0, 0, 0, 0))
    # Center the resized image
    x = (size[0] - resized.width) // 2
    y = (size[1] - resized.height) // 2
    new_img.paste(resized, (x, y))
    images.append(new_img)
    print(f"Created {size[0]}x{size[1]} icon")

# Delete old file first
if os.path.exists(output_path):
    os.remove(output_path)
    print(f"Removed old favicon.ico")

# Save as ICO - proper method
img_16 = images[0]
img_16.save(output_path, format='ICO', sizes=[(16,16), (32,32), (48,48), (64,64)])

new_size = os.path.getsize(output_path)
print(f"\nSuccessfully created {output_path}")
print(f"New file size: {new_size} bytes")

# Verify the file was created correctly
if new_size > 1000:
    print("✓ Favicon created successfully with proper size!")
else:
    print("✗ Warning: File might not be correct, trying alternative method...")
    
    # Alternative method - save each size
    os.remove(output_path)
    img.save(output_path, format='ICO', sizes=[(16,16), (24,24), (32,32), (48,48), (64,64), (128,128), (256,256)])
    new_size = os.path.getsize(output_path)
    print(f"Alternative method - New file size: {new_size} bytes")
