import cv2
import numpy as np

def calWeight(d,k):
  '''
  :param d: 融合重叠部分直径
  :param k: 融合计算权重参数
  :return:
  '''
 
  x = np.arange(-d / 2, d / 2)
  y = 1 / (1 + np.exp(-k * x))
  return y


def imgFusion(img1,img2,overlap,left_right=True):
  '''
  图像加权融合
  :param img1:
  :param img2:
  :param overlap: 重合长度
  :param left_right: 是否是左右融合
  :return:
  '''
  # 这里先暂时考虑平行向融合
  w = calWeight(overlap,0.05)    # k=5 这里是超参

  if left_right:  # 左右融合
    height, width = img1.shape
    img_new = np.zeros((height, 2*width))
    img_new[:, :width] = img1
    img_new[:, width:] = img2
    w_expand = np.tile(w, (height,1))  # 权重扩增
    img_new[:,width-int(overlap/2) : width+int(overlap/2)] = (1-w_expand)*img1[:,width-overlap:width]+w_expand*img2[:,:overlap]
  else:   # 上下融合
    width,height = img1.shape
    img_new = np.zeros((2*width-overlap,height))
    img_new[:width,:] = img1
    w = np.reshape(w,(overlap,1))
    w_expand = np.tile(w,(1,height))
    img_new[width-overlap:width,:] = (1-w_expand)*img1[width-overlap:width,:]+w_expand*img2[:overlap,:]
    img_new[width:,:] = img2[overlap:,:]
  return img_new

def jointImage(imagePath1, imagePath2):
  img1 = cv2.imread(imagePath1)
  img2 = cv2.imread(imagePath2)
  img = cv2.hconcat([img1, img2])
  cv2.imwrite('./jointImage.png', img)

def stitchImage(imagePath1, imagePath2):
  # 读取要拼接的图像
  image1 = cv2.imread(imagePath1)
  image2 = cv2.imread(imagePath2)

  # 创建 Stitcher 对象
  stitcher = cv2.Stitcher_create(cv2.Stitcher_PANORAMA)

  # 进行图像拼接
  status, stitched_image = stitcher.stitch([image1, image2])

  # 检查图像拼接是否成功
  if status == cv2.Stitcher_OK:
      cv2.imshow('Stitched Image', stitched_image)
      cv2.waitKey(0)
      cv2.destroyAllWindows()
  else:
      print("Image stitching failed!")

def partMedianBlur(img, distance=20):
  # print(img.shape)
  height, width, _ = img.shape
  width = int(width / 2)
  imgPart = img[:, width - distance : width + distance]
  imgPart = cv2.medianBlur(imgPart, 3)
  img[:, width - distance : width + distance] = imgPart
  return img

def pngToBmp():
  img = cv2.imread(r'./jointImage.png', cv2.IMREAD_UNCHANGED)
  cv2.imwrite(r'./jointImage.bmp', img)

if __name__ =="__main__":
  # stitchImage(r'weld_1.png', r'weld_2.png')
  img1 = cv2.imread("./weld_6.png",cv2.IMREAD_UNCHANGED)
  img2 = cv2.imread("./weld_7.png",cv2.IMREAD_UNCHANGED)
  img1 = (img1 - img1.min())/img1.ptp()
  img2 = (img2 - img2.min())/img2.ptp()
  img_new = imgFusion(img1,img2,overlap=100)
  img_new = np.uint16(img_new*65535)
  cv2.imwrite('./newImage.png', img_new)






