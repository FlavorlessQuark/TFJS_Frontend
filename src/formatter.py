from matplotlib import pyplot as plt
import numpy as np
import os


files = os.listdir("data/raw")

# while


# print(imgs[0])

# f = open("data/apple.npy")

# format =  28 * 28

# f.read(1)

# # img = f.read(format)
def format_data(data, train_ct, test_ct, name) :
    train_data = []
    test_data = []

    for i in range(train_ct):
        train_data += data[i].tolist()

    for i in range(test_ct):
        test_data += data[i + train_ct].tolist()

    with open("data/training/" + name, "wb+") as f:
        f.write(bytes(train_data))
    with open("data/testing/" + name, "wb+") as f:
        f.write(bytes(test_data))


TRAIN_CT = 5000
TEST_CT = 500
for x in files:
    images = np.load("data/raw/" + x)
    format_data(images, TRAIN_CT, TEST_CT, x[:-4])
# print(files)
# imgs[1].astype('uint8').tofile('test.bin')
# plt.imshow(curr,cmap="grey")
# plt.show()
