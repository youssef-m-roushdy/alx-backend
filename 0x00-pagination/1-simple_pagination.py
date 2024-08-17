#!/usr/bin/env python3
"""Task 1: Simple pagination.
"""
import csv
import math
from typing import List


def index_range(page, page_size):
    """
    Calculate the start and end indexes for pagination.
    """
    start_idx = (page - 1) * page_size
    end_idx = page * page_size
    return tuple([start_idx, end_idx])


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Retrieves a page of data.
        """
        assert isinstance(page, int) and isinstance(page_size, int)
        assert page > 0 and page_size > 0
        ds = self.dataset()
        start_idx, end_idx = index_range(page, page_size)
        if len(ds) < start_idx:
            return []
        else:
            return ds[start_idx:end_idx]
