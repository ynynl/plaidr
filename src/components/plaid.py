import matplotlib.pyplot as plt
import numpy as np
import numpy.typing as npt
from PIL import Image
from io import BytesIO
import base64
import math

class Plaid:
    def __init__(self, colors: list, pivots: list, size: int, twill: str):
        if (size % 4 != 0):
            raise Exception("Tartan size must be multiples of four.")
        if (len(colors) != len(pivots)+1):
            raise Exception("num of colors must be one more than the num of pivots (background).")
        self.colors = np.array(colors)
        self.pivots = np.array(pivots)
        self.size = size
        self.twill = twill
        self.array = self.__generate()

    __patterns = {
        'tartan': np.array([
            [1, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [1, 1, 0, 0]
        ]).astype('bool'),

        'madras': np.array([
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 1, 1],
            [0, 0, 1, 1]
        ]).astype('bool'),

        'net': np.array([
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [1, 0, 1, 0],
            [0, 1, 0, 1]
        ]).astype('bool'),
    }

    def get_png(self, width: int=None, height: int=None) -> str:
        if not width:
            width = self.size
        if not height:
            height = self.size
        resized = self.__resize(width, height)
        image = Image.fromarray(np.uint8(resized))
        buffered = BytesIO()
        image.save(buffered, format="png")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return "data:image/  png;base64," + img_str

    def show(self, width: int=None, height: int=None) -> None:
        if not width:
            width = self.size
        if not height:
            height = self.size
        resized = self.__resize(width, height)
        plt.figure()
        plt.imshow(resized)
        plt.axis('off')
        plt.show()

    def __resize(self, width: int, height:int) -> npt.NDArray:
        col = math.ceil(width / self.size)
        row = math.ceil(height / self.size)
        resized = np.tile(self.array, (col, row, 1))
        resized = np.delete(resized, np.s_[height:], axis = 0)
        resized = np.delete(resized, np.s_[width:], axis = 1)
        return resized

    def __generate(self) -> npt.NDArray:
        num_of_band = len(self.colors)
        sett = np.zeros((1, self.size, 3)).astype(int)
        sett[0, :] = self.colors[-1][:3] # use the last color as the background
        for i in range(0, num_of_band-1): # add bands
            threads = ((sett.shape[1]-1) * self.pivots[i]).astype(int)  # Transfer the float arrary into two int numbers
            sett[:, threads[0]:threads[1]] = self.colors[i][:3]
        wrap =  np.tile(sett, (self.size, 1, 1)) # expand sett pattern to NxN shape
        selected_pattern = self.__patterns[self.twill]
        num_tile = int(self.size/len(selected_pattern))
        mask = np.tile(selected_pattern, (num_tile, num_tile))
        wrap[mask] = np.rot90(wrap)[mask] # apply twill
        return wrap


def random_pivots(num_of_band: int):
    random_n2 = np.random.rand(num_of_band-1,2)
    return np.sort(random_n2)

def sorted_pivots_by_width(pivots):
    working_pivots = pivots.T # nx2 for calculating the width 
    width = np.array(working_pivots[1]-working_pivots[0])  # nx1
    width_reshape = np.reshape(width, (1, len(width))) #[nx1]
    working_pivots = np.concatenate((working_pivots, width_reshape)).T # nx3 -> 3xn
    sorted_indexes = working_pivots[:, 2].argsort() 
    return pivots[sorted_indexes[::-1]] # sort by width and make to paint the big one first