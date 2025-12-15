import os
import warnings

# 忽略ffmpeg相关警告
warnings.filterwarnings("ignore", message="Couldn't find ffmpeg or avconv")

# 如果需要完全禁用警告
# os.environ["PYDUB_IGNORE_WARNINGS"] = "1"

# 如果安装了ffmpeg，取消下面的注释并设置正确的路径
# os.environ["FFMPEG_BINARY"] = "C:/ffmpeg/bin/ffmpeg.exe"
# os.environ["IMAGEMAGICK_BINARY"] = "C:/Program Files/ImageMagick-7.1.1-Q16-HDRI/magick.exe"